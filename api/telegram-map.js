// Static User Collection to replicate structural database storage
// let staticEmployeeDB = [
//     { employee_id: "EMP1024", name: "Rahul Kumar", phone: "919167655538", telegram_chat_id: null, status: "Pending" },
//     // { employee_id: "EMP1025", name: "Amit Sharma", phone: "918765432109", telegram_chat_id: null, status: "Pending" },
//     // { employee_id: "EMP1026", name: "Priya Patel", phone: "917654321098", telegram_chat_id: null, status: "Pending" }
// ];

// Double check that your static list has the exact same text structure:
let staticEmployeeDB = [
    { employee_id: "EMP1024", name: "Sunil Ghate pSR", phone: "919167655538", telegram_chat_id: null, status: "Pending" },
    { employee_id: "EMP1025", name: "Amit Sharma", phone: "918765432109", telegram_chat_id: null, status: "Pending" }
];


module.exports = async (req, res) => {
    // Standard CORS configuration rules
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    const { employee_id, telegram_chat_id } = req.body;
    const employee = staticEmployeeDB.find(emp => emp.employee_id === employee_id);

    if (!employee) {
        return res.status(404).json({ success: false, message: "Employee ID not found in directory." });
    }

    // 1. Update the static object records in active memory
    employee.telegram_chat_id = telegram_chat_id;
    employee.status = "Active";

    // 2. VISUAL LOGGING: This will print the Chat ID clearly in your Vercel logs!
    console.log("==========================================");
    console.log(`[ERP MAPPING SUCCESS]`);
    console.log(`PSR Name:        ${employee.name}`);
    console.log(`Employee ID:     ${employee_id}`);
    console.log(`Telegram ChatID: ${telegram_chat_id}`); // <--- Displays the dynamic chat ID
    console.log(`Status Updated:  ${employee.status}`);
    console.log("==========================================");

    console.log(`[ERP Verification] Mapped employee ${employee.name} (${employee_id}) -> Chat ID: ${telegram_chat_id}`);

    // If you pass your token to Vercel environment variables, the bot will fire an out-of-band message
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (BOT_TOKEN) {
        try {
            await fetch(`https://telegram.org{BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: telegram_chat_id,
                    text: `🔒 Security Notification: Account configuration verified for ${employee_id}. Direct DM routing channel activated.`
                })
            });
        } catch (e) { console.error("Optional API delivery issue:", e); }
    }

    return res.status(200).json({ success: true, message: "ERP mapping complete.", updated_employee: employee });
};
