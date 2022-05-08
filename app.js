const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const headingName = $('header h4')
const headingSinger = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const player = $('.player')
const playBtn = $('.btn.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const previewBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: true,
    isRandom: false,
    isRepeat: false,

    songs: [
        {
            name: '86 - Eighty Six',
            singer: 'AMV',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Unstoppable',
            singer: 'Sia',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Lovely',
            singer: 'Billie Eilish',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Dusk Till Dawn',
            singer: 'ZAYN',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'AnhThemDuocNgu',
            singer: 'KHOI',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'Arcade',
            singer: 'Duncan Laurence',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Touche',
            singer: 'Chill',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'get you the moon',
            singer: 'kina',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'ThucGiac',
            singer: 'Chill',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
        }
        
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${this.currentIndex === index? 'active': ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const _this = this
        const cdwidth = cd.offsetWidth

        //Xử lý quay
        const cdAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdAnimate.pause()

        //Xử lý cuộn
        document.onscroll = function() {
            const scroll = window.scrollY || document.documentElement.scrollTop
            const newCdwidth = cdwidth - scroll
            
            cd.style.width = newCdwidth  > 0 ? newCdwidth + 'px' : 0
            cd.style.opacity = newCdwidth / cdwidth
        }
        //Nút play

        audio.onplay = function() {
            _this.isPlaying = false
            player.classList.add('playing')
            cdAnimate.play()
        }

        audio.onpause = function() {
            _this.isPlaying = true
            player.classList.remove('playing')
            cdAnimate.pause()
        }

        playBtn.onclick = function() {
            _this.isPlaying ? audio.play() : audio.pause()
        }
        //Thanh thời gian phát
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //Khi tua
        progress.onchange = function(e) {
            audio.currentTime = Math.floor(e.target.value * audio.duration / 100)
        }
        //next bai hat
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToactive()
        }
        //Trở về trước bài hát
        previewBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.previewSong()
            }
            audio.play()
            _this.render()
            _this.scrollToactive()
        }
        // Next bài hát
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.onclick()
            }
        }
        //Phát lại

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        //Random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
        }
        
        //chọn bài hát
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()


                }
            }

        }

    },
    scrollToactive: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth'
            })
        }, 500);
    },

    loadCurrentSong: function() {
        headingName.textContent = this.currentSong.name
        headingSinger.textContent = this.currentSong.singer
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path

    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0 
        }
        this.loadCurrentSong()
    },
    previewSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random()* this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },


    start: function() {
        //Định nghĩa thuộc tính cho Obj
        this.defineProperties()

        //Xử lý các sự kiện (DOM Event)
        this.handleEvents()

        //Tải bài hát lên
        this.loadCurrentSong()

        //Render ra HTML
        this.render()
    }
}

app.start()

const objA = {
    name: 'lam',
    age: 21
}
const objB = objA
    objB.name = 'teo'
    objB.age = 20

console.log(objA)