const simbolos = ["🐯", "💰", "🍊", "🎆", "💎"];

window.girarSlots = () => {
    const colunas = document.querySelectorAll('.coluna');
    let giros = 0;
    
    // Animação de giro
    const intervalo = setInterval(() => {
        colunas.forEach(col => {
            const divs = col.querySelectorAll('.simbolo');
            divs.forEach(d => d.innerText = simbolos[Math.floor(Math.random() * simbolos.length)]);
        });
        giros++;
        if (giros > 15) {
            clearInterval(intervalo);
        }
    }, 100);
};

window.alterarAposta = (mod) => {
    const display = document.getElementById("valor-aposta");
    let valor = parseFloat(display.innerText.replace("R$ ", "").replace(",", ".")) + (mod * 2);
    if (valor < 2) valor = 2;
    display.innerText = `R$ ${valor.toFixed(2).replace(".", ",")}`;
};
