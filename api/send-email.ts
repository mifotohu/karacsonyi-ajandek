// A Vercel/Node.js-kompatibilis kérés- és válaszobjektumok típusait `any`-ként definiáljuk,
// mivel nincs `package.json`-ünk, így nem tudjuk importálni a `@vercel/node` típusait.
type VercelRequest = any;
type VercelResponse = any;

// A típusokat a frontendről másoljuk át, hogy elkerüljük a bonyolult megosztási logikát
// egy egyszerűsített build rendszer nélküli projektben.
type Service = 'gepsimito' | 'studio' | 'perplexity' | 'ai_alapok' | 'leo_halado';

interface FormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    billingName: string;
    billingTaxNumber: string;
    billingZip: string;
    billingCity: string;
    billingAddress: string;
    participantCount: 1 | 2;
    selectedServices: Service[];
    preferredMonth: string;
    notes: string;
    agreedToTerms: boolean;
    newsletterSignup: boolean;
}

interface Discount {
    label: string;
    amount: number;
}

interface PriceDetails {
    baseTotal: number;
    discounts: Discount[];
    finalTotal: number;
}

// A szolgáltatás ID-k leképezése olvasható nevekre az e-mailben.
const SERVICE_NAMES: Record<Service, string> = {
    gepsimito: 'Gépsimító',
    studio: 'Stúdió fotózás alapjai',
    perplexity: 'Perplexity AI kereső alapjai',
    ai_alapok: 'AI képgenerálás alapjai',
    leo_halado: 'Leonardo AI tudásbázis - haladó',
};

const currencyFormatter = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
});

function generateHtmlBody(formData: FormData, priceDetails: PriceDetails): string {
    const servicesList = formData.selectedServices.map(id => `<li>${SERVICE_NAMES[id] || id}</li>`).join('');
    const discountsList = priceDetails.discounts.map(d => `<li>${d.label}: <strong>${currencyFormatter.format(d.amount)}</strong></li>`).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; color: #333; line-height: 1.6; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                h1, h2 { color: #c5a572; border-bottom: 2px solid #f0e6d8; padding-bottom: 5px; }
                h1 { font-size: 24px; }
                h2 { font-size: 20px; margin-top: 30px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
                th { background-color: #fdfaf5; width: 150px; }
                .total { font-weight: bold; font-size: 1.2em; }
                .total td { color: #c5a572; }
                ul { padding-left: 20px; margin: 0; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #aaa; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Új mentorálás megrendelés</h1>
                <p>Új megrendelés érkezett a Pragerfoto weboldalról. Az alábbiakban találod a részleteket.</p>
                
                <h2>Megrendelő adatai</h2>
                <table>
                    <tr><th>Név</th><td>${formData.customerName}</td></tr>
                    <tr><th>Email</th><td>${formData.customerEmail}</td></tr>
                    <tr><th>Telefon</th><td>${formData.customerPhone || 'Nincs megadva'}</td></tr>
                </table>

                <h2>Számlázási adatok</h2>
                <table>
                    <tr><th>Név</th><td>${formData.billingName}</td></tr>
                    <tr><th>Cím</th><td>${formData.billingZip} ${formData.billingCity}, ${formData.billingAddress}</td></tr>
                    <tr><th>Adószám</th><td>${formData.billingTaxNumber || 'Nincs megadva'}</td></tr>
                </table>

                <h2>Rendelés részletei</h2>
                <table>
                    <tr><th>Résztvevők</th><td>${formData.participantCount} fő</td></tr>
                    <tr><th>Tervezett időpont</th><td>${formData.preferredMonth}</td></tr>
                    <tr><th>Kiválasztott szolgáltatások</th><td><ul>${servicesList}</ul></td></tr>
                    <tr><th>Megjegyzés</th><td>${formData.notes || 'Nincs'}</td></tr>
                </table>

                <h2>Ár összesítő</h2>
                <table>
                    <tr><th>Részösszeg</th><td>${currencyFormatter.format(priceDetails.baseTotal)}</td></tr>
                    ${priceDetails.discounts.length > 0 ? `<tr><th>Kedvezmények</th><td><ul>${discountsList}</ul></td></tr>` : ''}
                    <tr class="total"><th>Fizetendő végösszeg</th><td>${currencyFormatter.format(priceDetails.finalTotal)}</td></tr>
                </table>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p>Feliratkozás hírlevélre: <strong>${formData.newsletterSignup ? 'Igen' : 'Nem'}</strong></p>
                <div class="footer">
                    <p>Ez egy automatikusan generált e-mail.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { formData, priceDetails } = req.body;
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        console.error('RESEND_API_KEY is not set.');
        return res.status(500).json({ success: false, message: 'Szerver konfigurációs hiba.' });
    }
    
    if (!formData || !priceDetails) {
        return res.status(400).json({ success: false, message: 'Hiányzó űrlap adatok.' });
    }

    const htmlBody = generateHtmlBody(formData, priceDetails);

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                from: 'Pragerfoto Rendelés <info@pragerfoto.hu>', // FONTOS: Ennek a domainnek igazolva kell lennie a Resend fiókban.
                to: ['info@pragerfoto.hu'],
                reply_to: formData.customerEmail,
                subject: `Új mentorálás megrendelés: ${formData.customerName}`,
                html: htmlBody,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, message: 'Email sent successfully.' });
        } else {
            console.error('Resend API error:', data);
            return res.status(500).json({ success: false, message: 'Az e-mail küldése sikertelen volt.', error: data });
        }
    } catch (error) {
        console.error('Error sending email:', error);
        const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba történt.';
        return res.status(500).json({ success: false, message: 'Belső szerverhiba történt.', error: errorMessage });
    }
}