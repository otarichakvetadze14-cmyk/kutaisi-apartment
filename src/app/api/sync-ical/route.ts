import { NextResponse } from 'next/server';
import ical from 'node-ical';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const icalUrl = process.env.BOOKING_ICAL_URL;

    if (!icalUrl) {
      return NextResponse.json(
        { success: false, error: 'BOOKING_ICAL_URL environment variable is not set' },
        { status: 400 }
      );
    }

    const webEvents = await ical.async.fromURL(icalUrl);
    let newBookingsCount = 0;

    for (const key in webEvents) {
      const event = webEvents[key];

      if (event.type === 'VEVENT' && event.start && event.end) {
        const externalId = event.uid || `${event.start.toISOString()}-${event.summary}`;
        const startDate = event.start.toISOString().split('T')[0];
        const endDate = event.end.toISOString().split('T')[0];
        const guestName = event.summary || 'External Booking';

        const { data: existing } = await supabase
          .from('bookings')
          .select('id')
          .eq('external_id', externalId)
          .single();

        if (!existing) {
          const { error: insertError } = await supabase.from('bookings').insert([
            {
              external_id: externalId,
              source: 'iCal_Sync',
              guest_name: guestName,
              date_range: `${startDate} to ${endDate}`,
              status: 'confirmed',
            },
          ]);

          if (!insertError) {
            newBookingsCount++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync completed successfully. ${newBookingsCount} new bookings added.`,
    });
  } catch (error: any) {
    console.error('iCal sync error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}// Test deployment fix