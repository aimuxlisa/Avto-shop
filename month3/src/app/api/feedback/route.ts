import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const { name, contact, message, website } = rawBody;

    // Honeypot check: if bot filled 'website', quietly return ok without forwarding
    if (website && typeof website === 'string' && website.trim().length > 0) {
      return NextResponse.json({ ok: true, message: "Заявка принята" });
    }

    // Required fields validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: "Пожалуйста, укажите ваше имя" },
        { status: 400 }
      );
    }

    if (!contact || typeof contact !== 'string' || !contact.trim()) {
      return NextResponse.json(
        { ok: false, error: "Пожалуйста, укажите контактный телефон или email" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { ok: false, error: "Пожалуйста, напишите ваше сообщение или вопрос" },
        { status: 400 }
      );
    }

    // Forward to CRM API
    const crmBaseUrl = (process.env.CRM_API_URL || "http://localhost:3001").replace(/\/+$/, "");
    const crmSecret = process.env.CRM_API_SECRET || "vespera_crm_secret_key_2026";

    const crmPayload = {
      name: name.trim(),
      contact: contact.trim(),
      message: message.trim(),
      source: "website_form",
    };

    let crmResponse: Response;
    try {
      crmResponse = await fetch(`${crmBaseUrl}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-crm-api-secret": crmSecret,
        },
        body: JSON.stringify(crmPayload),
        signal: AbortSignal.timeout(10000),
      });
    } catch (networkErr: any) {
      console.error("CRM Network Error:", networkErr);
      return NextResponse.json(
        { ok: false, error: "Сервис CRM временно недоступен. Пожалуйста, повторите попытку через минуту." },
        { status: 502 }
      );
    }

    if (!crmResponse.ok) {
      const errorData = await crmResponse.json().catch(() => ({}));
      console.error("CRM Rejected Lead:", crmResponse.status, errorData);
      return NextResponse.json(
        { ok: false, error: errorData?.error || "Не удалось сохранить заявку в CRM" },
        { status: crmResponse.status >= 400 && crmResponse.status < 500 ? 400 : 502 }
      );
    }

    const crmData = await crmResponse.json();

    return NextResponse.json({
      ok: true,
      leadId: crmData.leadId,
      clientId: crmData.clientId,
      message: "Заявка успешно принята и передана в CRM!",
    });
  } catch (err: any) {
    console.error("Feedback route error:", err);
    return NextResponse.json(
      { ok: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
