import { NextResponse } from 'next/server';
import ical from 'node-ical';
import { createClient } from '@supabase/supabase-js';

// Supabase კლიენტის ინიციალიზაცია
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  const icalUrl = process.env.BOOKING_ICAL_URL;

  if (!icalUrl) {
    return NextResponse.json(
      { error: 'BOOKING_ICAL_URL environment variable is missing' },
      { status: 400 }
    );
  }

  try {
    // 1. წავიკითხოთ iCal ფაილი მითითებული URL-დან
    const events = await ical.async.fromURL(icalUrl);

    const syncedBookings = [];

    // 2. გადავუაროთ iCal-ის თითოეულ ჩანაწერს
    for (const event of Object.values(events)) {
      if (event.type === 'VEVENT') {
        const startDate = new Date(event.start).toISOString().split('T')[0];
        const endDate = new Date(event.end).toISOString().split('T')[0];
        const externalId = event.uid; // iCal-ის უნიკალური ID
        const summary = event.summary || 'External Booking (Booking.com / Airbnb)';

        // 3. შევამოწმოთ, ხომ არ არსებობს უკვე ეს ჯავშანი ბაზაში
        const { data: existingBooking } = await supabase
          .from('bookings')
          .select('id')
          .eq('external_id', externalId)
          .single();

        // 4. თუ ჯერ არ არსებობს, ჩავწეროთ Supabase-ში
        if (!existingBooking) {
          const { data, error } = await supabase
            .from('bookings')
            .insert([
              {
                external_id: externalId,
                check_in: startDate,
                check_out: endDate,
                guest_name: summary,
                source: 'iCal_Sync',
                status: 'confirmed',
              },
            ])
            .select();

          if (error) {
            console.error('Error inserting booking:', error);
          } else {
            syncedBookings.push(data);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync completed successfully. ${syncedBookings.length} new bookings added.`,
    });
  } catch (error: any) {
    console.error('iCal sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync iCal' },
      { status: 500 }
    );
  }
}