const textElement = document.getElementById('text')
const optionButtonsElement = document.getElementById('option-buttons')

let state = {}

function startGame() {
  state = {}
  showTextNode(1)
}

function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(textNode => textNode.id === 
    textNodeIndex)
  textElement.innerText = textNode.text
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }

  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button')
      button.innerText = option.text
      button.classList.add('btn')
      button.addEventListener('click', () => selectOption(option))
      optionButtonsElement.appendChild(button)
    }
  })
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

function selectOption(option) {
    const nextTextNodeId = option.nextText
    if (nextTextNodeId <= 0) {
        return startGame()
    }
    state = Object.assign(state, option.setState)
    showTextNode(nextTextNodeId)
}

const textNodes = [
    {
        id: 1, 
                /*   
                    .1 = skenario pilihan ke-1, 
                    .2 = skenario pilihan ke-2 (termasuk kemenangan), 
                    .3 = kekalahan 
                */
        text:   'Prolog: Sebuah kota besar metropolitan mempunyai 3 sektor; Industri, Komersil, dan Residensial. Kalangan ini, polusi menjadi perbincangan utama masyarakat kota besar tersebut & mereka juga meminta pihak pemerintah & walikota untuk mengambil suatu tindakan. \n Kamu bermain sebagai walikota kota tersebut - ambilah beberapa tindakan berikut yang bisa memberikan nasib terbaik bagi kotamu. Semoga beruntung!',
        options: [
            {
                text: 'Pilihan No. 1: Kurangi waktu pengoperasian pabrik-pabrik',
                setState: { RegulasiIndustri: true },
                nextText: 2.1
            },
            {
                text: 'Pilihan No. 2: Menunggu pemasukan sebelum menjalankan program apapun',
                setState: { Cash: true },
                nextText: 2.2
            }

        ]
    },
    {
        id: 2.1, /* SKENARIO 1: REGULASI WAKTU OPERASIONAL PABRIK */
        text: 'Setelah tindakan yang kamu ambil untuk meregulasikan waktu operasional pabrik, keuangan menjadi masalah baru yang muncul. Dalam situasi ini apa yang akan kamu lakukan sebagai walikota?',
        options: [
            {
                text: 'Menginformasikan masyarakat wilayah residensial untuk membiasakan hidup hemat demi mengurangi biaya hidup sehari-hari & meningkatkan penghasilan, serta dana pemerintah',
                requiredState: (currentState) => currentState.RegulasiIndustri,
                setState: { RegulasiIndustri: false, BlueprintPLTS: true },
                nextText: 3.1
            },
            {
                text: 'Mengkomisikan pembangunan sebuah Pembangkit Listrik Tenaga Surya baru, menggantikan pembangkit listrik yang sebelumnya mengandalkan bahan bakar fosil & menimbulkan polusi',
                requiredState: (currentState) => currentState.RegulasiIndustri,
                nextText: 1.3
            },
        ]
    },
    {
        id: 3.1,
        text: 'Dengan masyarakat menerapkan kebiasaan hidup hemat dengan program 3R mereka, kepemerintahan sekarang sudah mengembalikan situasi ekonomi menjadi stabil - tetapi tidak meningkat karena sektor perindustrian yang diregulasikan sebelumnya. Apa tindakanmu selanjutnya?',
        options: [
            {
                text: 'Mengembangkan lebih banyak pusat komersil seperti perkantoran, toko-toko & ruko untuk meningkatkan perekonomian masyarakat pada jangka panjang.',
                requiredState: (currentState) => currentState.BlueprintPLTS,
                setState: { RegulasiIndustri: false, BlueprintPLTS: true },
                nextText: 2.3
            },
            {
                text: 'Cari solusi terhadap pembuangan limbah industri & penggunaan bahan bakunya agar aktivitas perindustrian bisa terus dilanjutkan tanpa masalah',
                requiredState: (currentState) => currentState.BlueprintPLTS,
                nextText: 4.1
            },
        ]
    },
    {
        id: 2.2, /* SKENARIO 2: LANJUTKAN AKTIVITAS PABRIK */
        text: 'Dengan dilanjutkannya aktivitas pabrik, ekonomi kota berlangsung dengan baik. Namun polusi masih menjadi masalah yang dihadapi masyarakat kalangan sektor Komersil. Ada 2 proyek yang tertera dalam agenda walikotamu, manakah yang akan kamu jalankan?',
        options: [
            {
                text: 'Bangun lebih banyak wilayah perkantoran dengan taman disekitar daerah perkantoran/Komersil.',
                requiredState: (currentState) => currentState.Cash,
                setState: { RegulasiIndustri: false, Cash: true },
                nextText: 3.2
            },
            {
                text: 'Menerima perusahaan asing yang meminta izin untuk mendirikan wilayah Residensial dengan taman-taman yang besar.',
                requiredState: (currentState) => currentState.Cash,
                nextText: 3.3
            },
        ]
    },
    {
        id: 3.2, 
        text: 'Masih banyak hal yang perlu kamu lakukan untuk mengurangi polusi, namun dengan dibangunnya lebih banyak perkantoran & taman-taman, keuanganmu semakin bergantung kepada sektor Industri. Tindakan apa yang akan kamu ambil pada saat ini?',
        options: [
            {
                text: 'Dekomisikan pembangkit listrik bertenaga bahan bakar fosil dari sektor Industri yang pada awalnya berkontribusi terhadap asap-asap polusi di kota terlebih dahulu.',
                requiredState: (currentState) => currentState.Cash,
                nextText: 4.3
            },
            {
                text: 'Mulai dengan memberikan dana pada warga daerah Residensial untuk memasang panel surya pada atap rumah mereka, lalu dekomisikan pabrik-pabrik yang menjadi emiten polusi utamanya.',
                requiredState: (currentState) => currentState.Cash,
                setState: { Cash: false, PanelSurya: true },
                nextText: 4.2
            },
        ]
    },
    {
        id: 4.1, /* good ending ke-1 */
        text: 'Akhirnya, warga kotamu bisa menikmati kegiatan sehari-hari mereka tanpa adanya polusi, mereka juga tidak harus kesusahan dalam perekonomian mereka lagi dengan pengembangan sektor industri dengan penerapan ramah lingkungan yang baru. (Hasil: Keberhasilan Industri Hijau)',
        options: [
            {
                text: 'Kamu menang! Ulangi permainan?',
                nextText: 1
            },
        ]
    },
    {
        id: 4.2, /* good ending ke-2 */
        text: 'Karena tindakanmu untuk menghimbau warga sektor Residensial & Komersil pada awalnya untuk memasang panel surya pada atap rumah & bangunan mereka, perekonomianmu tidak sebagian besar diberatkan pada pihak Industri lagi - akhirnya regulasi pada sektor Industri dapat diberikan, dan tingkat polusi kota juga berkurang. (Hasil: Keberhasilan Upaya Masyarakat)',
        options: [
            {
                text: 'Kamu menang! Ulangi permainan?',
                nextText: 1
            },
        ]
    },
    {
        id: 1.3, /* bad ending ke-1 */
        text: 'Keuangan pemerintah kurang! regulasi waktu operasional pabriknya baru saja dijalankan dan belum ada efek penuh - sebagai hasil, warga protes akibat naiknya harga komoditas sehari-hari. (Hasil: Kegagalan akibat kekurangan dana.)',
        options: [
            {
                text: 'Kamu gagal, restart permainan?',
                nextText: 1
            },
        ]
    },
    {
        id: 2.3, /* bad ending ke-2 */
        text: 'Dana pemerintah yang awalnya didapat dari program sebelumnya malah dipakai untuk kepentingan memperluas sektor komersil, mengembalikan masalah polusi ke kota tersebut karena maraknya asap kendaraan dari jalanan disekitar perkantoran. (Hasil: Kegagalan akibat kembalinya masalah polusi.)',
        options: [
            {
                text: 'Kamu gagal, restart permainan?',
                nextText: 1
            },
        ]
    },
    {
        id: 3.3, /* bad ending ke-3 */
        text: 'Perusahaan asing yang kamu perbolehkan untuk membangun perkantoran & taman tersebut secara tidak terduga menjebakmu dalam harga yang sangat mahal - pada akhirnya kamu punya hutang besar. (Hasil: Kegagalan akibat bangkrut.)',
        options: [
            {
                text: 'Kamu gagal, restart permainan?',
                nextText: 1
            },
        ]
    },
    {
        id: 4.3, /* bad ending ke-4 */
        text: 'Seperti yang sebelumnya dijelaskan, perekonomian sektor kotamu masih dengan penuh mengandalkan sektor Industri sebagai sumber pendapatan besar, dan akhirnya banyak bangunan Residensial & Komersil ditutup akibat kurangnya barang baku yang didapatkan dari sektor Industri. (Hasil: Kegagalan akibat kekurangan komoditas.)',
        options: [
            {
                text: 'Kamu gagal, restart permainan?',
                nextText: 1
            },
        ]
    }
]

startGame()