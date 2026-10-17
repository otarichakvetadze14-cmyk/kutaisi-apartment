import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Supabase Webhook-იდან მოსული ჩანაწერი
    const booking = payload.record;

    if (!booking) {
      return NextResponse.json({ error: 'No booking record found' }, { status: 400 });
    }

    const { guest_name, guest_email, date_range, total_price } = booking;

    // 1. მეილის გაგზავნა სტუმართან
    if (guest_email) {
      await resend.emails.send({
        from: 'Kutaisi Central Square <onboarding@resend.dev>',
        to: [guest_email],
        subject: 'თქვენი ჯავშანი მიღებულია! / Booking Confirmation',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>გამარჯობა, ${guest_name}!</h2>
            <p>თქვენი ჯავშანი ქუთაისის ცენტრალურ მოედანზე წარმატებით დარეგისტრირდა.</p>
            <hr />
            <p><strong>თარიღები:</strong> ${date_range}</p>
            <p><strong>ჯამური ფასი:</strong> ${total_price} GEL</p>
            <hr />
            <p>ჩვენი მენეჯერი მალე დაგიკავშირდებათ დეტალების დასაზუსტებლად.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}