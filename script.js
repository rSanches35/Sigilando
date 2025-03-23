document.addEventListener("DOMContentLoaded", function () {

    selecionarCategoria("todos");

    mapeamentoSigilos = [
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
        ".", ",", ":", ";", "?", "!"
    ];
});

// Estado global da categoria ativa
let letraEsperada = "";
let numeroSigiloAtual = 0;
let categoriaAtual = { min: 1, max: 32 };

// Mapeamento direto para cada sigilo (1 a 32)
const mapeamentoSigilos = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    ".", ",", ":", ";", "?", "!"
];

const sigilosRecentes = ["", "", "", "", "", "", "", ""];
const sigilosRecentesPontos = ["", "", ""];

function selecionarCategoria(tipo) {

    if (somAtivo) tocarSom(somConfig);

    if (tipo === "letras") {
        categoriaAtual = { min: 1, max: 26 };
    } else if (tipo === "pontos") {
        categoriaAtual = { min: 27, max: 32 };
    } else {
        categoriaAtual = { min: 1, max: 32 };
    }

    sigilosRecentes.fill("");
    sigilosRecentesPontos.fill("");

    document.querySelectorAll(".botoes button").forEach(botao => {
        botao.classList.remove("botao-selecionado");
    });
    document.querySelector(`button[data-tipo="${tipo}"]`).classList.add("botao-selecionado");

    carregarSigilo();
}

// Sons
const somConfig = new Audio('sons/volume.mp3');
const somCorreto = new Audio('sons/correto.mp3');
const somIncorreto = new Audio('sons/incorreto.mp3');

function tocarSom(som) {
    som.pause();   // Pausa o som caso ainda esteja tocando
    som.currentTime = 0;  // Reinicia o áudio
    som.play();  // Reproduz o som
}

// Variável para controlar o estado do som (ativo ou mudo)
let somAtivo = true;

// Referências aos elementos do DOM
const sigiloAleatorio = document.getElementById("sigiloAleatorio");
const iconeVolume = document.getElementById("iconeVolume");
const controleVolume = document.getElementById("controleVolume");
const inputElement = document.querySelector('input[type="text"]');

// Função para carregar novo sigilo
function carregarSigilo() {

    numeroSigiloAtual = Math.floor(Math.random() * (categoriaAtual.max - categoriaAtual.min + 1)) + categoriaAtual.min;
    letraEsperada = mapeamentoSigilos[numeroSigiloAtual - 1];

    if (categoriaAtual.min === 1) {

        while (sigilosRecentes.includes(letraEsperada)) {

            numeroSigiloAtual = Math.floor(Math.random() * (categoriaAtual.max - categoriaAtual.min + 1)) + categoriaAtual.min;
            letraEsperada = mapeamentoSigilos[numeroSigiloAtual - 1];
        }

        for(let i = sigilosRecentes.length; i >= 2; i--){

            sigilosRecentes[i-1] = sigilosRecentes[i-2];
        }
    
        sigilosRecentes[0] = letraEsperada;
    }
    else {

        while (sigilosRecentesPontos.includes(letraEsperada)) {

            numeroSigiloAtual = Math.floor(Math.random() * (categoriaAtual.max - categoriaAtual.min + 1)) + categoriaAtual.min;
            letraEsperada = mapeamentoSigilos[numeroSigiloAtual - 1];
        }

        for(let i = sigilosRecentesPontos.length; i >= 2; i--){

            sigilosRecentesPontos[i-1] = sigilosRecentesPontos[i-2];
        }
    
        sigilosRecentesPontos[0] = letraEsperada;
    }

    sigiloAleatorio.textContent = letraEsperada;
    sigiloAleatorio.className = "sigilo";

    document.body.classList.remove("hidden");
}

// Função para verificar a resposta
function verificarResposta() {
    const resposta = inputElement.value.trim().toLowerCase();

    if (resposta === letraEsperada) {
        if (somAtivo) tocarSom(somCorreto);
        sigiloAleatorio.classList.add("brilho");
        sigiloAleatorio.classList.add("sigilo-correto");

        adicionarResposta(letraEsperada);
        
        setTimeout(carregarSigilo, 1000);
    } else {
        if (somAtivo) tocarSom(somIncorreto);

        // Reinicia a animação do tilt
        sigiloAleatorio.classList.remove("sigilo-incorreto"); 
        void sigiloAleatorio.offsetWidth; // Força o reflow do elemento
        sigiloAleatorio.classList.add("sigilo-incorreto");

        // Garante que a cor volte ao normal após a animação
        setTimeout(() => {
            sigiloAleatorio.classList.remove("sigilo-incorreto");
        }, 500); // Deve ser um pouco maior que o tempo da animação CSS (0.2s * 3 loops)
    }

    inputElement.value = "";
}

// Alterna entre som ativo e mudo ao clicar no ícone
controleVolume.addEventListener("click", function () {
    if (!somAtivo) tocarSom(somConfig);
    somAtivo = !somAtivo;
    iconeVolume.src = somAtivo ? "imagens/volumeOn.png" : "imagens/volumeOff.png";
});

// Adiciona o evento "Enter" para verificar a resposta
inputElement.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        verificarResposta();
    }
});

function adicionarResposta(letraEsperada){}
