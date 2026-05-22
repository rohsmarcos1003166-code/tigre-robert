// LÓGICA DE EXECUÇÃO: TIGER VERTICAL SLOTS COM MEMÓRIA PIX LOCALSTORAGE
let saldo = parseFloat(localStorage.getItem('saldo')) || 50.00;
let apostaAtual = 2.00;
let jogadasEfetuadas = parseInt(localStorage.getItem('jogadasEfetuadas')) || 0;
let estaGirando = false;

// Símbolos baseados na imagem real do jogo do tigre enviada
const simbolosSlot = ['🐯', '💰', '🍊', '🎆', '🧧', '🐯'];

function iniciarLayoutReels() {
    for (let i = 0; i < 3; i++) {
        const targetReel = document.getElementById(`reel-${i}`);
        if (targetReel) {
            targetReel.innerHTML = '';
            // Gera múltiplos itens empilhados para criar o efeito contínuo de rolagem vertical
            for (let j = 0; j < 12; j++) {
                const item = document.createElement('div');
                item.className = 'slot-item';
                item.innerText = simbolosSlot[(j + i) % simbolosSlot.length];
                targetReel.appendChild(item);
            }
        }
    }
    atualizarExibicaoSaldo();
}

function atualizarExibicaoSaldo() {
    const elSaldo = document.getElementById('saldo');
    if (elSaldo) elSaldo.innerText = `R$ ${saldo.toFixed(2)}`;
    localStorage.setItem('saldo', saldo.toFixed(2));
    localStorage.setItem('jogadasEfetuadas', jogadasEfetuadas);
}

window.alterarAposta = function(direcao) {
    if (estaGirando) return;
    if (direcao === 1 && apostaAtual < 20.00) apostaAtual += 2.00;
    if (direcao === -1 && apostaAtual > 2.00) apostaAtual -= 2.00;
    
    const elAposta = document.getElementById('valor-aposta');
    if (elAposta) elAposta.innerText = `R$ ${apostaAtual.toFixed(2)}`;
};

// DISPARO DAS COLUNAS VERTICAIS (MECÂNICA REELS)
window.girarSlots = function() {
    if (estaGirando) return;

    if (saldo < apostaAtual) {
        alert("Saldo insuficiente! Adicione fundos para continuar.");
        window.abrirModalDeposito();
        return;
    }

    estaGirando = true;
    saldo -= apostaAtual;
    jogadasEfetuadas++;
    atualizarExibicaoSaldo();

    // Aplica a classe CSS que executa a rolagem vertical rápida (@keyframes rolarVertical)
    for (let i = 0; i < 3; i++) {
        const targetReel = document.getElementById(`reel-${i}`);
        if (targetReel) targetReel.classList.add('rodando-vertical');
    }

    // Controle rígido de resultados (Sua regra mantida intacta)
    setTimeout(() => {
        let multiplicador = 0;
        
        if (jogadasEfetuadas >= 8) {
            // Trava total no azar após a 8 rodada
            multiplicador = 0;
        } else {
            // Sorteio interno de coeficientes
            const sorteio = Math.random();
            if (sorteio < 0.4) multiplicador = 0;
            else if (sorteio < 0.75) multiplicador = 2;
            else if (sorteio < 0.93) multiplicador = 5;
            else multiplicador = 10;
        }

        // Interrompe a animação vertical e fixa os itens finais de exibição
        for (let i = 0; i < 3; i++) {
            const targetReel = document.getElementById(`reel-${i}`);
            if (targetReel) {
                targetReel.classList.remove('rodando-vertical');
                targetReel.innerHTML = '';
                
                let simboloResultado = simbolosSlot[Math.floor(Math.random() * simbolosSlot.length)];
                if (multiplicador > 0) {
                    if (multiplicador === 10) simboloResultado = '🐯'; // Tigre/Wild paga o topo
                    else if (multiplicador === 5) simboloResultado = '💰';
                    else simboloResultado = '🧧';
                } else {
                    // Sem prêmio: força símbolos desalinhados/diferentes por coluna
                    simboloResultado = simbolosSlot[(i * 2) % simbolosSlot.length];
                }

                for (let j = 0; j < 3; j++) {
                    const item = document.createElement('div');
                    item.className = 'slot-item';
                    item.innerText = simboloResultado;
                    targetReel.appendChild(item);
                }
            }
        }

        // Processamento financeiro do prêmio sorteado
        if (multiplicador > 0) {
            const ganho = apostaAtual * multiplicador;
            saldo += ganho;
            alert(`🎉 Parabéns! O Tigre liberou um ganho de R$ ${ganho.toFixed(2)} (${multiplicador}x)`);
        }
        
        estaGirando = false;
        atualizarExibicaoSaldo();
    }, 1800);
};

// CONTROLE DO MODAL FINANCEIRO COM PERSISTÊNCIA PIX
window.abrirModalDeposito = function() {
    const modal = document.getElementById('modal-deposito');
    if (modal) {
        modal.style.display = 'flex';
        // Auto-preenche com as informações salvas no navegador anteriormente, se houverem
        if(localStorage.getItem('pix_chave_salva')) {
            document.getElementById('pix-chave').value = localStorage.getItem('pix_chave_salva');
            document.getElementById('pix-nome').value = localStorage.getItem('pix_nome_salvo');
            document.getElementById('pix-cidade').value = localStorage.getItem('pix_cidade_salva');
        }
    }
};

window.fecharModalDeposito = function() {
    const modal = document.getElementById('modal-deposito');
    if (modal) modal.style.display = 'none';
};

window.salvarEDepositarPIX = function() {
    const chave = document.getElementById('pix-chave').value.trim();
    const nome = document.getElementById('pix-nome').value.trim();
    const cidade = document.getElementById('pix-cidade').value.trim();
    const valorStr = document.getElementById('pix-valor-dep').value;
    const valorDep = parseFloat(valorStr) || 20.00;

    if (!chave || !nome) {
        alert("Por favor, insira ao menos a Chave PIX e o Nome para salvar!");
        return;
    }

    // GRAVAÇÃO RÍGIDA DAS INFORMAÇÕES DO PIX NO LOCALSTORAGE
    localStorage.setItem('pix_chave_salva', chave);
    localStorage.setItem('pix_nome_salvo', nome);
    localStorage.setItem('pix_cidade_salva', cidade);

    // Executa a simulação do crédito do depósito adicionando ao saldo atual
    saldo += valorDep;
    atualizarExibicaoSaldo();
    
    alert(`✅ Informações salvas com sucesso!\nDepósito de R$ ${valorDep.toFixed(2)} foi creditado em sua conta.`);
    window.fecharModalDeposito();
};

window.sacar = function() {
    alert("❌ Saque bloqueado! Atinja o faturamento mínimo exigido na conta antes de efetuar saques via PIX.");
};

window.addEventListener('DOMContentLoaded', iniciarLayoutReels);
