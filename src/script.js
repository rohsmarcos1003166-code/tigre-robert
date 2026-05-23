const simbolos = ["🐯", "💰", "🍊", "🎆", "💎"];

window.girarSlots = () => {
    const colunas = document.querySelectorAll('.coluna');
    let giros = 0;
    
    const intervalo = setInterval(() => {
        colunas.forEach(col => {
            const divs = col.querySelectorAll('.simbolo');
            divs.forEach(d => d.innerText = simbolos[Math.floor(Math.random() * simbolos.length)]);
        });
        giros++;
        if (giros > 15) {
            clearInterval(intervalo);
            verificarVitoria();
        }
    }, 100);
};

function verificarVitoria() {
    // Simulação: 30% de chance de ganhar para teste
    if (Math.random() > 0.7) {
        const msg = document.getElementById('notificacao');
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 3000);
    }
}

window.alterarAposta = (mod) => {
    const display = document.getElementById("valor-aposta");
    let valor = parseFloat(display.innerText.replace("R$ ", "").replace(",", ".")) + (mod * 2);
    if (valor < 2) valor = 2;
    display.innerText = `R$ ${valor.toFixed(2).replace(".", ",")}`;
};
