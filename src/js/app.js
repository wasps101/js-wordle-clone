// Получаем объект со словарем и запускаем игру
// Fetch не сработает локально, для запуска необходим сервер (например, Apache)
const newGame = () => {
    fetch('src/json/dictionary.json')
        .then((data) => {
            return data.json()       
        })
        .then((data) => {
            startGame(data)
    })
}

function startGame(data) {
    let dictionary = data
    // Получаем рандомное случайное слово из словаря
    let goalWord = dictionary[Math.round(Math.random() * dictionary.length)]
    // Инициализируем пустое текущее вводимое слово, которое будем обрабатывать позднее инпутом пользователя
    let currentWord = ''
    // Инициализируем индекс текущей попытки
    let currentAttempt = 0
    // Создаем массив со всеми html-элементами клавиатуры
    const keys = [].slice.call(document.querySelectorAll('.key'))
    // Создаем массив со всеми html-элементами попыток пользователя
    const attempts = [].slice.call(document.querySelectorAll('.attempt'))
    // Создаем строку со всеми допустимыми символами
    const letters = 'qwertyuiopasdfghjklzxcvbnm'

    // Создаем функцию обработки клика по элементу клавиатуры, которую позднее передадим в слушатель события
    // Внутри мы проверяем какую клавишу нажал пользователь: если это не символ, то обрабатываем их отдельно
    // Если это символ, то записываем значение клавиши в currentWord
    const keyClick = (e) => {
        let letter = true

        if (e.target.innerHTML == 'BACKSPACE' || e.target.innerHTML == 'ENTER') {
            letter = false
        }

        if (e.target.innerHTML == 'ENTER') {
            enterWord(goalWord, currentWord)
        }

        if (currentWord.length < 5 && letter) {  
            currentWord += e.target.innerHTML
        }

        if (e.target.innerHTML == 'BACKSPACE') {  
            currentWord = currentWord.slice(0, -1)
        }
        
        // Рендерим наш currentWord, то есть записываем значение currentWord в элемент текущей попытки

        let attempt = [].slice.call(attempts[currentAttempt].querySelectorAll('.letter'))
        
        attempt.forEach(key => {key.innerHTML = ''})

        for (i = 0; i < currentWord.length; i++) {
            attempt[i].innerHTML = currentWord[i]
        }
    }

    // Объявляем слушатель события клика по клавиатуре
    keys.forEach(key => {
        key.addEventListener('click', keyClick)
    })

    // Проверяем введенное пользователем слово.
    // Выводим сообщения в случае неккоректного слова: если в слове меньше 5 букв или если слово не найдено в словаре
    // В случае, если попытки закончились, то выводим сообщение о поражении, слово, которое нужно было отгадать и перезагружаем игру
    // Если слово корректное, то запускаем функцию отображения совпавших символов, увеличиваем индекс currentAttempt и обнуляем currentWord
    const enterWord = (word, guess) => {
        if (guess.length < 5) {
            alert('The word must contain 5 letters')
            return
        }

        if (!dictionary.includes(guess.toLowerCase())) {
            alert("We're sorry, but there's no such word in our dictionary")
            return
        }

        if (guess.length === 5 && dictionary.includes(guess.toLowerCase())) {
            matchWord(word, guess)
            currentAttempt++

            if (currentAttempt === 6) {
                setTimeout(function() {alert(`You've lost :( The word was: ${goalWord}`)}, 300*5)
                setTimeout(function() {
                    location.reload()
                }, 300*5)
                return
            }

            currentWord = ''
        }
    }


    // Проверяем корректно введенное слово на совпадение символов.
    const matchWord = (goalWord, playerWord) => {

        // Если введенное слово совпадает с загаданным, то выставляем хендлер isWon в положение true
        let isWon = false
        if (goalWord.toLowerCase() === playerWord.toLowerCase()) {
            isWon = true
        }

        // Создаем два массива с символами текущего введенного слова и символами загаданного слова
        let goal = goalWord.toLowerCase().split('')
        let guess = playerWord.toLowerCase().split('')

        // Создаем массив объектов для каждого проверенного символа, который затем передадим в функцию рендера
        let toRender = []

        // Проверяем каждый символ через цикл.
        // Данные о статусе в формате строки (это будущие классы каждого элемента символа) и символе передаем в формате объекта в наш массив проверенных символов
        for (let i = 0; i < 5; i++) {
            
            let status = ''

            if (!goal.includes(guess[i])) {
                status = 'grey'
            } else {
                if (guess[i] === goal[i]) {
                    status = 'green'
                } else {
                    status = 'yellow'
                }
                delete goal[goal.indexOf(guess[i])]
            }

            toRender.push({letter: guess[i], status: status})
        }

        // Запускаем функцию рендера наших символов, передав массив символов и хендлер проверки победы пользователя
        render(toRender, isWon)
    }

    // Создаем функцию рендера проверенных символов в текущей попытке
    const render = (word, isWon) => {
        // Создаем массив элементов символов текущей попытки, куда мы будем записывать наше слово
        const attemptElements = [].slice.call(attempts[currentAttempt].querySelectorAll('.letter'))
        // Инициализируем список известных символов на клавиатуре
        let knownKeys = []

        for (i=0; i<5; i++) {
            // Запускаем рендер каждого символа с отсрочкой, равной времени transition элемента
            setTimeout(renderLetter, 300 * i, attemptElements[i], word[i].status)

            // Добавляем в известные символы объект с html-элементом клавиатуры и статусом (цветом)
            knownKeys.push( 
                {key: document.querySelector(`[data-letter=${word[i].letter}]`),
                status: word[i].status}
            )
        }

        // Запускаем рендер изменения цвета известных клавиш, отложенный на время рендера отображения текущего слова
        knownKeys.forEach(letter => {
            if (letter.status != 'yellow') {
                setTimeout(function() {letter.key.classList.add(letter.status)}, 300 * 5)
            }
        })

        // Если пользователь победил, то выводим сообщение, отложенное на время рендера слова, и перезапускаем игру
        if (isWon) {
            setTimeout(function() {alert(`You've won!`)}, 300*5)
            setTimeout(function() {
                location.reload()
            }, 300*5)
            return
        }

    }

    // Создаем функцию рендера каждого символа.
    // Функция добавляет к текущему классу элемента класс, регулирующей отображение символа (серым, желтым или зеленым цветом)
    const renderLetter = (cell, status) => {
        cell.classList.add(status)
    }

    // Симулируем клик по букве (dom-элементу), когда нажимаем на нее на клавиатуре
    // Хотя сперва показалось странным решением, мне нравится, что нам не нужно дублировать логику
    // И в таком виде это решение занимает всего несколько строк

    const keyPress = (e) => {
        let key = e.key.toLowerCase() // чтобы работало с зажатым шифтом
        if (letters.includes(key) || e.keyCode == 13 || e.keyCode == 8) {               
            document.querySelector(`[data-letter=${key}`).click()   
        }
    }

    window.addEventListener('keydown', keyPress)
}

// Запускаем новую игру
newGame()