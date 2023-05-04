const tabela = document.getElementById('tabela');
const itens = JSON.parse(localStorage.getItem("itens")) || [];

function criarNovoItem(event) {
    event.preventDefault();
    const descricao = document.getElementById('descricao');
    const valor = document.getElementById('valor')
    const tipos = document.querySelectorAll('input[type="radio"][name="tipo"]');
    for (let i = 0; i < tipos.length; i++) {
        if (tipos[i].checked) {
            var tipoMarcado = tipos[i].value;
            break;
        }
    }
    if (descricao.value === "" || valor.value === "" || tipoMarcado === "") {
        alert("Você deve preencher todos os campos.");
        return;
    }
    const novoItem = {
        "tipo": tipoMarcado,
        "descricao": descricao.value,
        "valor": valor.value,
        "id": itens.length
    };
    itens.push(novoItem);
    localStorage.setItem("itens", JSON.stringify(itens));

    const novaLinha = criarNovaLinha(novoItem);
    tabela.appendChild(novaLinha);

    descricao.value = '';
    valor.value = '';
    tipos.forEach((tipo) => {
        tipo.checked = false;
    });
    atualizarValor();
}

//criar td para cada elemento
function criarNovaCelula(dado) {
    const novaCelula = document.createElement('td');
    novaCelula.innerHTML = dado;
    const novaCelulaStyle = { 
        padding: '10px',
        boxSizing: 'border-box',
        maxWidth: '100px',
        wordWrap: 'break-word'
    }
    Object.assign(novaCelula.style, novaCelulaStyle)
    return novaCelula;
}

//criar nova linha na tabela
function criarNovaLinha(item) {
    const novaLinha = document.createElement('tr');

    novaLinha.appendChild(criarNovaCelula(item.tipo));
    novaLinha.appendChild(criarNovaCelula(item.descricao));
    novaLinha.appendChild(criarNovaCelula(`R$ ${item.valor}`));
    
    const botaoDeletar = document.createElement('td');
    const img = document.createElement('img');
    img.src = 'assets/delete.svg';
    img.width = '20';
    img.style.cursor = 'pointer';
    botaoDeletar.appendChild(img);
    botaoDeletar.addEventListener('click', () => {
        novaLinha.remove();
        itens.splice(itens.findIndex(e => e.id === item.id), 1);
        localStorage.setItem("itens", JSON.stringify(itens));
        atualizarValor();
    });
    novaLinha.appendChild(botaoDeletar);
    novaLinha.style.boxShadow = '0px 4px 4px rgba(0, 0, 0, 0.25)';
    return novaLinha;
}

//atualizar o saldo 
function atualizarValor() {
    let total = 0;
    itens.forEach((item) => {
        if (item.tipo === "Receita"){
            total += Number(item.valor)
        } else {
            total -= Number(item.valor)
        }
    });
    document.getElementById('saldo').textContent = total.toFixed(2)
    localStorage.setItem("saldo", total.toFixed(2))
}

//recuperar itens do local storage
itens.forEach((item) => {
    const novaLinha = criarNovaLinha(item);
    tabela.appendChild(novaLinha);
});
const saldo = localStorage.getItem("saldo")
document.getElementById('saldo').innerText = saldo ? saldo : "0.00";
