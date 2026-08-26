import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export const defaultDemoNotification = {
  badge: 'Free Demo Class',
  title: 'Full-Stack Java + Angular + AI',
  subtitle: 'Live online session - absolutely free!',
  date: 'Sat, 15th Aug 2026',
  time: '7:00 PM IST',
  mode: 'Online (Zoom)',
  fee: 'FREE',
  primaryCtaLabel: '🚀 Reserve My Free Seat',
  primaryCtaUrl: '/demo',
  secondaryCtaLabel: "No thanks, I'll skip this",
  isActive: true,
}

function normalizeNotification(row) {
  if (!row) return defaultDemoNotification
  return {
    id: row.id || null,
    badge: row.badge || defaultDemoNotification.badge,
    title: row.title || defaultDemoNotification.title,
    subtitle: row.subtitle || defaultDemoNotification.subtitle,
    date: row.event_date || defaultDemoNotification.date,
    time: row.event_time || defaultDemoNotification.time,
    mode: row.mode || defaultDemoNotification.mode,
    fee: row.fee || defaultDemoNotification.fee,
    primaryCtaLabel: row.primary_cta_label || defaultDemoNotification.primaryCtaLabel,
    primaryCtaUrl: row.primary_cta_url || defaultDemoNotification.primaryCtaUrl,
    secondaryCtaLabel: row.secondary_cta_label || defaultDemoNotification.secondaryCtaLabel,
    isActive: typeof row.is_active === 'boolean' ? row.is_active : defaultDemoNotification.isActive,
  }
}

export default function useDemoNotification(options = {}) {
  const { activeOnly = false, multiple = false } = options
  const [notification, setNotification] = useState(defaultDemoNotification)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    let mounted = true

    async function fetchNotification() {
      let query = supabase
        .from('demo_notifications')
        .select('*')
        .order('updated_at', { ascending: false })
        .order('created_at', { ascending: false })

      if (activeOnly) {
        query = query.eq('is_active', true)
      }

      if (!multiple) {
        query = query.limit(1)
      }

      const { data, error } = await query
      if (!mounted) return

      if (error) {
        if (activeOnly) {
          setNotification({ ...defaultDemoNotification, isActive: false })
          setNotifications([])
        }
        return
      }

      if (multiple) {
        const rows = data || []
        if (!rows.length) {
          setNotifications([])
          if (activeOnly) {
            setNotification({ ...defaultDemoNotification, isActive: false })
          }
          return
        }

        const normalized = rows.map(normalizeNotification)
        setNotifications(normalized)
        setNotification(normalized[0])
        return
      }

      const row = data?.[0]
      if (!row) {
        if (activeOnly) {
          setNotification({ ...defaultDemoNotification, isActive: false })
        }
        return
      }

      setNotification(normalizeNotification(row))
    }

    fetchNotification()

    return () => {
      mounted = false
    }
  }, [activeOnly, multiple])

  return { notification, notifications }
}

