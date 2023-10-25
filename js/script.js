const main = document.querySelector('.main'),
scoreBoard = document.querySelector('span.score'),
errorBoard = document.querySelector('span.errors'),
template = document.querySelector('.tmplt'),
btn_x = document.querySelector('.btn_x'),
black_box = document.querySelector('.black'),
msg_box = document.querySelector('.msg'),
clock = document.querySelector('.clock'),
counters = document.querySelector('.counters'),
start_btn = document.querySelector('.start'),
parser = new DOMParser(),
correct_sfx = new Audio('./assets/correct.wav'),
wrong_sfx = new Audio('./assets/wrong.wav'),
gameover_sfx = new Audio('./assets/gameover.wav'),
aplause_sfx = new Audio('./assets/aplause.wav');

let score = error = trials = m = s =  0, 
counter = previous = null, array = [], time = '';

btn_x.addEventListener('click', () => {
    black_box.classList.remove('gameover');
    window.location.reload();

})

// Retorna uma array de 2x o tamanho 'q' com valores repetidos 2x e embaralhados.
const half = (q) => {
    let arr = [], n = 0;
    while (arr.length < q) {
        n = ~~(Math.random() * q);
        if (arr.indexOf(n) === -1)
            arr.push(n);
    }
    return arr;
}

/**
 * Inicia o jogo recebrndo um valor 'x' e 
 * criando uma array de tamanho 2x
 * */
const init = (x) => {
    start_btn.classList.toggle('off');
    array = half(x).concat(half(x));
    trials = x;
    main.innerHTML = '';
    array.forEach((value) => {
        /**
         * Para cada valor da array, faz uma cópia do conteúdo do template e 
         * insere uma imagem de acordo com o valor.
         * Adiciona o comportamento do click no card.
         * Inicializa os computadores de pontos.
         * Inicia o Cronômetro.
         */
        let div = parser.parseFromString(template.innerHTML, 'text/html').body.firstChild;
        let card = new Image();
        card.src = `./img/pic-${value + 1}.png`;
        card.classList.add('card');
        div.appendChild(card);
        clickAction(div);
        main.appendChild(div);
        scoreBoard.innerHTML = score;
        errorBoard.innerHTML = `${error}/${trials}`;
    });
    startCounter();
}

const format = (i) => i < 10 ? '0' + i : i;

// Contador de tempo 
const startCounter = () => {
    counter = setInterval(() => {
        s += s < 10 - 1 ? 1 : -s;
        m += s == 0 ? 1 : 0;
        time = `${format(m)}:${format(s)}`;
        clock.innerHTML = time;
    }, 1000);
    counters.classList.toggle('off');
}

// Para contador e retorna o tempo
const endCounter = () => {
    clearInterval(counter);
    return time;
}

/**
 * Ação ao clicar:
 * Primeiro vira uma carta, e verifica se já foi aberta alguma antes.
 * Caso seja a primeira (previous == null), coloca a carta para ser a primeira.
 * Caso já tenhauma carta como primeira, esta é a segundae é feito o teste.
 */
const clickAction = (target) => {
    target.addEventListener('click', () => {
        if (!target.classList.contains('open')) {
            target.classList.add('open');
            if (previous == null) {
                previous = target;
            } else {
                test(previous, target);
                previous = null;

            }
        }
    });
}    

// Testa se as 2 cartas tem o mesmo endereço.
const test = (first, last) => {
    if (first.children[1].src == last.children[1].src) {
        /**
         * Caso positivo, se a pontuação ainda não atingiu o número de cartas diferentes,
         * incrementa o score e faz as 2 cartas Temerem.
         */
        if (++score < trials) {
            scoreBoard.innerHTML = score;
            correct_sfx.play();
            first.classList.add('shake');
            last.classList.add('shake');
        } else win() // E se já atingiu, o jogo foi vencido.
    } else {
        wrong_sfx.play();
        turn(first, last);
        if (++error < trials) {
            errorBoard.innerHTML = `${error}/${trials}`;
        } else lose();
    }
}

// Desvira as 2 cartas
const turn = (first, last) => {
    setTimeout(() => {
        first.classList.remove('open');
        last.classList.remove('open');
    }, 1000);
    return;
}

const win = () => {
    aplause_sfx.play();
    msg_box.append('PARABENS!\nVocê encontrou todas as figuras!\n');
    msg_box.append(`num tempo de ${endCounter()}\n`);
    msg_box.append(`restando ${trials - error} tentativas.`);
    black_box.classList.add('gameover');
}

const lose = () => {
    gameover_sfx.play();
    msg_box.append(`Voce fez ${score} pontos\n`);
    msg_box.append(`em ${endCounter()}\n`);
    black_box.classList.add('gameover');
}

// Comando para virar ou desvirar todas as cartas para facilitar o desenvolvimento.
addEventListener('keydown', ({code}) => {
    if (code == 'KeyX') {
        document.querySelectorAll('.child').forEach(child => {
            child.classList.toggle('open');
        })
    }
})

start_btn.addEventListener('click', () => init(10));
// addEventListener('DOMContentLoaded', () => init(10))
