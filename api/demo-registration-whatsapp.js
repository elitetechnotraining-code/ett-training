const DEFAULT_SUPPORT_NUMBER = '919059571845'
const DEFAULT_LANGUAGE_CODE = 'en'

function json(res, statusCode, body) {
  res.status(statusCode).setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function normalizePhoneNumber(value, defaultCountryCode = '91') {
  const digits = String(value || '').replace(/\D/g, '')
  if (!digits) return ''
  const trimmed = digits.startsWith('00') ? digits.slice(2) : digits
  if (trimmed.length === 10 && defaultCountryCode) {
    return `${defaultCountryCode}${trimmed}`
  }
  return trimmed
}

function buildAdminText({ registration, demo }) {
  return [
    'New demo registration received',
    `Name: ${registration.name}`,
    `Email: ${registration.email}`,
    `Phone: ${registration.phone}`,
    `Experience: ${registration.experience}`,
    `Demo: ${demo.title}`,
    `Schedule: ${demo.date} at ${demo.time}`,
    `Mode: ${demo.mode}`,
    `Fee: ${demo.fee}`,
    demo.url ? `Open demo page: ${demo.url}` : null,
  ].filter(Boolean).join('\n')
}

function buildUserText({ registration, demo }) {
  return [
    `Hi ${registration.name}, thanks for registering with Elite Tech Solutions!`,
    '',
    `Your seat is confirmed for ${demo.title}.`,
    `Date: ${demo.date}`,
    `Time: ${demo.time}`,
    `Mode: ${demo.mode}`,
    `Fee: ${demo.fee}`,
    demo.url ? `Demo details: ${demo.url}` : null,
    '',
    'We will share the joining link and reminder on WhatsApp before the session.',
  ].filter(Boolean).join('\n')
}

// WATI: template message — POST {base}/sendTemplateMessage?whatsappNumber={to}
// WATI: free-text session message — POST {base}/sendSessionMessage/{to}
async function sendWatiMessage({ to, body, templateName, templateParams, accessToken, watiBaseUrl }) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }

  if (templateName) {
    const url = `${watiBaseUrl}/sendTemplateMessage?whatsappNumber=${to}`
    const payload = {
      template_name: templateName,
      broadcast_name: templateName,
      parameters: templateParams.map((value, index) => ({
        name: String(index + 1),
        value: String(value ?? ''),
      })),
    }
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      throw new Error(data?.errors?.[0] || data?.message || `WATI API returned ${response.status}`)
    }
    return data
  }

  // Falls back to session message when no template is configured.
  // Only works within the 24-hour WhatsApp conversation window.
  const url = `${watiBaseUrl}/sendSessionMessage/${to}`
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messageText: body }),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.errors?.[0] || data?.message || `WATI API returned ${response.status}`)
  }
  return data
}

// Meta Business API path — used when WHATSAPP_PHONE_NUMBER_ID is set instead of WHATSAPP_WEBHOOK_URL
async function sendMetaWhatsAppMessage({ to, body, templateName, templateParams, accessToken, phoneNumberId, languageCode }) {
  const payload = templateName
    ? {
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode || DEFAULT_LANGUAGE_CODE },
          components: templateParams?.length
            ? [{ type: 'body', parameters: templateParams.map(text => ({ type: 'text', text: String(text ?? '') })) }]
            : undefined,
        },
      }
    : {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { preview_url: false, body },
      }

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.error?.message || `WhatsApp API returned ${response.status}`)
  }
  return data
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { ok: false, error: 'Method not allowed' })
  }

  const registration = req.body?.registration
  const demo = req.body?.demo

  if (!registration?.name || !registration?.email || !registration?.phone || !registration?.experience || !demo?.title) {
    return json(res, 400, { ok: false, error: 'Missing required registration details' })
  }

  const defaultCountryCode = process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || '91'
  const adminNumber = normalizePhoneNumber(process.env.WHATSAPP_ADMIN_TO || DEFAULT_SUPPORT_NUMBER, defaultCountryCode)
  const userNumber = normalizePhoneNumber(registration.phone, defaultCountryCode)

  const notifications = {
    admin: { attempted: false, delivered: false },
    user: { attempted: false, delivered: false },
  }

  const watiBaseUrl = process.env.WHATSAPP_WEBHOOK_URL
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const languageCode = process.env.WHATSAPP_TEMPLATE_LANGUAGE_CODE || DEFAULT_LANGUAGE_CODE

  const adminText = buildAdminText({ registration, demo })
  const userText = buildUserText({ registration, demo })

  // WATI path takes priority when WHATSAPP_WEBHOOK_URL is set
  const isWati = !!(watiBaseUrl && accessToken)
  const isMeta = !isWati && !!(accessToken && phoneNumberId)

  if (!isWati && !isMeta) {
    return json(res, 200, {
      ok: true,
      configured: false,
      notifications,
      message: 'Registration saved. WhatsApp auto-confirmation is not configured.',
    })
  }

  async function sendForTarget(target) {
    const to = target === 'admin' ? adminNumber : userNumber
    const body = target === 'admin' ? adminText : userText
    const templateName = target === 'admin'
      ? process.env.WHATSAPP_ADMIN_TEMPLATE_NAME
      : process.env.WHATSAPP_USER_TEMPLATE_NAME
    const templateParams = target === 'admin'
      ? [registration.name, registration.phone, demo.title, `${demo.date} ${demo.time}`, registration.experience]
      : [registration.name, demo.title, demo.date, demo.time, demo.mode, demo.fee]

    notifications[target].attempted = true

    if (!to) {
      notifications[target].error = 'Recipient phone number is missing or invalid'
      return
    }

    try {
      if (isWati) {
        await sendWatiMessage({ to, body, templateName, templateParams, accessToken, watiBaseUrl })
      } else {
        await sendMetaWhatsAppMessage({ to, body, templateName, templateParams, accessToken, phoneNumberId, languageCode })
      }
      notifications[target].delivered = true
    } catch (error) {
      notifications[target].error = error.message || 'Message delivery failed'
    }
  }

  await Promise.all([sendForTarget('admin'), sendForTarget('user')])

  const ok = notifications.admin.delivered || notifications.user.delivered
  return json(res, ok ? 200 : 502, {
    ok,
    configured: true,
    notifications,
  })
}
