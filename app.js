/* ── Theme (light 7am–7pm EST, dark 7pm–7am) ────────────────── */
function applyTheme() {
  const hour = parseInt(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    hour: 'numeric',
    hour12: false
  }).format(new Date()));
  document.body.classList.toggle('dark', hour >= 19 || hour < 7);
}

applyTheme();
setInterval(applyTheme, 60 * 1000);

const API_BASE = '';

/* ── Clock ──────────────────────────────────────────────────── */
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m  = String(now.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;

  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent    = `${h}:${m}`;
  document.getElementById('seconds').textContent  = `:${s}`;
  document.getElementById('ampm').textContent     = ap;
  const bigClock = document.getElementById('clock-big');
  if (bigClock) {
    bigClock.textContent                                   = `${h}:${m}`;
    document.getElementById('seconds-big').textContent    = `:${s}`;
    document.getElementById('ampm-big').textContent       = ap;
  }
}

updateClock();
setInterval(updateClock, 1000);

(function initClockMode() {
  const overlay = document.createElement('div');
  overlay.id = 'clock-overlay';
  overlay.innerHTML = `
    <div class="clock-big-wrap">
      <div class="clock-big-time">
        <span id="clock-big"></span><span class="clock-big-seconds" id="seconds-big"></span><span class="clock-big-ampm" id="ampm-big"></span>
      </div>
      <div class="clock-big-date" id="clock-big-date"></div>
    </div>`;
  document.body.appendChild(overlay);

  function updateDate() {
    const now = new Date();
    document.getElementById('clock-big-date').textContent =
      `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  }

  overlay.addEventListener('click', () => overlay.classList.remove('clock-overlay-active'));

  document.querySelector('.masthead-time').addEventListener('click', () => {
    updateDate();
    overlay.classList.add('clock-overlay-active');
  });
})();

/* ── Music ──────────────────────────────────────────────────── */
let musicSource = 'faves';

const FAVES = [
  { artist: "The Weeknd", album: "House of Balloons", year: 2011, art: "https://cdn-images.dzcdn.net/images/cover/912594cc88625ecbeeb6fce8ee178a74/500x500-000000-80-0-0.jpg" },
  { artist: "The Weeknd", album: "Thursday", year: 2011, art: "https://cdn-images.dzcdn.net/images/cover/ef5abb0ea84232ad1bfd99f6eca0a100/500x500-000000-80-0-0.jpg" },
  { artist: "The Weeknd", album: "Echoes of Silence", year: 2011, art: "https://cdn-images.dzcdn.net/images/cover/f115e1aaebba0dd82bb46eeb8f2f6c11/500x500-000000-80-0-0.jpg" },
  { artist: "The Weeknd", album: "Kiss Land", year: 2013, art: "https://cdn-images.dzcdn.net/images/cover/922d6979a91ce20e45e65c860b8eca45/500x500-000000-80-0-0.jpg" },
  { artist: "The Weeknd", album: "Starboy", year: 2016, art: "https://cdn-images.dzcdn.net/images/cover/134778e4c4f19ea71c82408300925a9a/500x500-000000-80-0-0.jpg" },
  { artist: "The Weeknd", album: "My Dear Melancholy", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/57792c20d4bc39849786a9e235fe60e5/500x500-000000-80-0-0.jpg" },
  { artist: "The Weeknd", album: "After Hours", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/f520bf0be2e3cfc476824e75d20a164a/500x500-000000-80-0-0.jpg" },
  { artist: "The Weeknd", album: "Hurry Up Tomorrow", year: 2025, art: "https://cdn-images.dzcdn.net/images/cover/e4b16c1afe136140bba34368357e8f05/500x500-000000-80-0-0.jpg" },
  { artist: "Drake", album: "If You're Reading This It's Too Late", year: 2015, art: "https://cdn-images.dzcdn.net/images/cover/1c1ca5ffababd01e1e7cc090cf296304/500x500-000000-80-0-0.jpg" },
  { artist: "Skepta", album: "That's Not Me", year: 2014, art: "https://cdn-images.dzcdn.net/images/cover/35f28cfcc16c28c769fbda0980d1c8b5/500x500-000000-80-0-0.jpg" },
  { artist: "Kendrick Lamar", album: "Good Kid Maad City", year: 2012, art: "https://cdn-images.dzcdn.net/images/cover/b5be27644d505bad7bdb516fe4165475/500x500-000000-80-0-0.jpg" },
  { artist: "Kendrick Lamar", album: "DAMN", year: 2017, art: "https://cdn-images.dzcdn.net/images/cover/7ce6b8452fae425557067db6e6a1cad5/500x500-000000-80-0-0.jpg" },
  { artist: "Kendrick Lamar", album: "To Pimp a Butterfly", year: 2015, art: "https://cdn-images.dzcdn.net/images/cover/00dd0da365a94b1829302d6b7fec70e6/500x500-000000-80-0-0.jpg" },
  { artist: "Kendrick Lamar", album: "Mr. Morale & the Big Steppers", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/412361ce41f0bd2595978dbf0e035ad3/500x500-000000-80-0-0.jpg" },
  { artist: "Kendrick Lamar", album: "GNX", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/da5256ff8cacfe9ad90521f6e3792259/500x500-000000-80-0-0.jpg" },
  { artist: "Calvin Harris", album: "Funk Wav Bounces Vol. 1", year: 2017, art: "https://cdn-images.dzcdn.net/images/cover/953237229a2d2a8d36c99faf24c337d7/500x500-000000-80-0-0.jpg" },
  { artist: "Childish Gambino", album: "Because the Internet", year: 2013, art: "https://cdn-images.dzcdn.net/images/cover/a07c38caadefae99abe4047dbcb0c778/500x500-000000-80-0-0.jpg" },
  { artist: "Childish Gambino", album: "Awaken My Love", year: 2016, art: "https://cdn-images.dzcdn.net/images/cover/57ae3715e73c0486616bab8c2d6c6159/500x500-000000-80-0-0.jpg" },
  { artist: "Childish Gambino", album: "Atavista", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/e93e23b2e0b2b028b30f3e81c32a768d/500x500-000000-80-0-0.jpg" },
  { artist: "Logic", album: "Under Pressure", year: 2014, art: "https://cdn-images.dzcdn.net/images/cover/f1e3f0800d9c289f9c36f6b5a6a1e22b/500x500-000000-80-0-0.jpg" },
  { artist: "Logic", album: "The Incredible True Story", year: 2015, art: "https://cdn-images.dzcdn.net/images/cover/996f34172d889b87eba40f49a927d98b/500x500-000000-80-0-0.jpg" },
  { artist: "Logic", album: "Bobby Tarantino", year: 2016, art: "https://cdn-images.dzcdn.net/images/cover/ac3dc57b36e52435b3154e1d2407b128/500x500-000000-80-0-0.jpg" },
  { artist: "Logic", album: "Bobby Tarantino II", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/ac3dc57b36e52435b3154e1d2407b128/500x500-000000-80-0-0.jpg" },
  { artist: "Logic", album: "YSIV", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/650ca4030d6c0a4587c85ed8bc4a4757/500x500-000000-80-0-0.jpg" },
  { artist: "Logic", album: "No Pressure", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/779659cc0ea0363c25fa7572163fa40f/500x500-000000-80-0-0.jpg" },
  { artist: "Logic", album: "College Park", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/94dc9cc8bd29165d7be85201f7bc0abe/500x500-000000-80-0-0.jpg" },
  { artist: "Logic", album: "Ultra 85", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/6cbd44cf417b2d911bd6f4b8ee966fbb/500x500-000000-80-0-0.jpg" },
  { artist: "Logic", album: "Vinyl Days", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/c9b24fed21412e38188e66ed3ee7ed8c/500x500-000000-80-0-0.jpg" },
  { artist: "Amine", album: "Good For You", year: 2017, art: "https://cdn-images.dzcdn.net/images/cover/877d7905c2e30ed19d984248f0dd349c/500x500-000000-80-0-0.jpg" },
  { artist: "Amine", album: "Limbo", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/dc55e31eb21a05f7a1794b468fb43a61/500x500-000000-80-0-0.jpg" },
  { artist: "Amine", album: "Kaytramine", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/7cd64a682d341d827adf44b615c6286b/500x500-000000-80-0-0.jpg" },
  { artist: "Amine", album: "ONEPOINTFIVE", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/baa71be1c6a5d47de2a02c7e7d5fb0ba/500x500-000000-80-0-0.jpg" },
  { artist: "Amine", album: "TWOPOINTFIVE", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/93d9251607a21317ed860233ec925633/500x500-000000-80-0-0.jpg" },
  { artist: "Frank Ocean", album: "Channel Orange", year: 2012, art: "https://cdn-images.dzcdn.net/images/cover/519400e29d268f449cf00af879e71af6/500x500-000000-80-0-0.jpg" },
  { artist: "Frank Ocean", album: "Blonde", year: 2016, art: "https://cdn-images.dzcdn.net/images/cover/aa7e6de00b0810f5051aa60b489f58d8/500x500-000000-80-0-0.jpg" },
  { artist: "Tyler the Creator", album: "Flower Boy", year: 2017, art: "https://cdn-images.dzcdn.net/images/cover/a7a16b8f63b1ec0e9fbd327619966737/500x500-000000-80-0-0.jpg" },
  { artist: "Tyler the Creator", album: "IGOR", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/041ab5ceb6fb6ebf9512966835be9e1b/500x500-000000-80-0-0.jpg" },
  { artist: "Tyler the Creator", album: "Call Me If You Get Lost", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/2d740784396546039fe626ac2b92877b/500x500-000000-80-0-0.jpg" },
  { artist: "Tyler the Creator", album: "Don't Tap the Glass", year: 2025, art: "https://cdn-images.dzcdn.net/images/cover/d79052872c09468fd80bd288928962c9/500x500-000000-80-0-0.jpg" },
  { artist: "Harry Styles", album: "Harry Styles", year: 2017, art: "https://cdn-images.dzcdn.net/images/cover/a41167cfcc7e840821fad5f5f5f91da2/500x500-000000-80-0-0.jpg" },
  { artist: "Harry Styles", album: "Fine Line", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/346c524c15ecccbc4a8a78e8972a352c/500x500-000000-80-0-0.jpg" },
  { artist: "Harry Styles", album: "Harry's House", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/7ca460e8c5b01391f1bdb316aff7419f/500x500-000000-80-0-0.jpg" },
  { artist: "Bruno Mars", album: "24K Magic", year: 2016, art: "https://cdn-images.dzcdn.net/images/cover/012b27906b430a37ec1d8f793d5c4fa6/500x500-000000-80-0-0.jpg" },
  { artist: "Post Malone", album: "beerbongs & bentleys", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/c000a4d39f31f3716bf3f11aa5fab080/500x500-000000-80-0-0.jpg" },
  { artist: "Post Malone", album: "Hollywood's Bleeding", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/4642b8e3e0a89f92a6e2bfed13d8f31c/500x500-000000-80-0-0.jpg" },
  { artist: "Post Malone", album: "Stoney", year: 2016, art: "https://cdn-images.dzcdn.net/images/cover/efd66ec02dc81074e5b3e7825db4c380/500x500-000000-80-0-0.jpg" },
  { artist: "Mac Miller", album: "Swimming", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/5c5774a43a421d37f58ae170df87b9e8/500x500-000000-80-0-0.jpg" },
  { artist: "Mac Miller", album: "Circles", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/f775144a9c375ada83e1e014920a4d9a/500x500-000000-80-0-0.jpg" },
  { artist: "Mac Miller", album: "Watching Movies with the Sound Off", year: 2013, art: "https://cdn-images.dzcdn.net/images/cover/f02794bc83c61d1441afbcc7579523ca/500x500-000000-80-0-0.jpg" },
  { artist: "Mac Miller", album: "Best Day Ever", year: 2011, art: "https://cdn-images.dzcdn.net/images/cover/5ef63468abea50687dc85606e4299eb6/500x500-000000-80-0-0.jpg" },
  { artist: "Mac Miller", album: "Balloonerism", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/07875c211437e1101d7e38b5a34393eb/500x500-000000-80-0-0.jpg" },
  { artist: "Mac Miller", album: "Faces", year: 2014, art: "https://cdn-images.dzcdn.net/images/cover/970914c7b4938ee5565888039018272a/500x500-000000-80-0-0.jpg" },
  { artist: "Mac Miller", album: "GO:OD AM", year: 2015, art: "https://cdn-images.dzcdn.net/images/cover/0d76e3eb79d06a3493f1cd7e08914f68/500x500-000000-80-0-0.jpg" },
  { artist: "Kanye West", album: "Yeezus", year: 2013, art: "https://cdn-images.dzcdn.net/images/cover/5a56530f7906bd9786fa47bd0be421b3/500x500-000000-80-0-0.jpg" },
  { artist: "Kanye West", album: "The Life of Pablo", year: 2016, art: "https://cdn-images.dzcdn.net/images/cover/e055ecc8d01680cda0460017087728be/500x500-000000-80-0-0.jpg" },
  { artist: "Kanye West", album: "ye", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/71d34b7f041d43ea821a9afaeab73666/500x500-000000-80-0-0.jpg" },
  { artist: "Kanye West", album: "My Beautiful Dark Twisted Fantasy", year: 2010, art: "https://cdn-images.dzcdn.net/images/cover/742aba8510ba803bea51d304cf2ca786/500x500-000000-80-0-0.jpg" },
  { artist: "Jay-Z & Kanye West", album: "Watch the Throne", year: 2011, art: "https://cdn-images.dzcdn.net/images/cover/5ff776f44edc5f7fbef5fa2169006f29/500x500-000000-80-0-0.jpg" },
  { artist: "Kanye West", album: "Graduation", year: 2007, art: "https://cdn-images.dzcdn.net/images/cover/8c6578a2099561992fb7544e6826f767/500x500-000000-80-0-0.jpg" },
  { artist: "Kids See Ghosts", album: "Kids See Ghosts", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/778fafd1b7e65b0b769be21ddd3f3e5a/500x500-000000-80-0-0.jpg" },
  { artist: "JPEGMAFIA", album: "Veteran", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/87e4b9fd63d562270b892580193cf84d/500x500-000000-80-0-0.jpg" },
  { artist: "JPEGMAFIA", album: "LP!", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/a6696f767c4d9abd6b776b2fa35d52cf/500x500-000000-80-0-0.jpg" },
  { artist: "JPEGMAFIA", album: "All My Heroes Are Cornballs", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/b2752b4190f78d1e013077519d7dfb6d/500x500-000000-80-0-0.jpg" },
  { artist: "JPEGMAFIA", album: "I Lay Down My Life for You", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/c8418b116aab96c6fb4714452ceb40d8/500x500-000000-80-0-0.jpg" },
  { artist: "JPEGMAFIA & Danny Brown", album: "Scaring the Hoes", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/e4cba71c38e5a5410c075ca60e639739/500x500-000000-80-0-0.jpg" },
  { artist: "Danny Brown", album: "Quaranta", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/017bdc29cc3e92bc7952473a2e8d1c04/500x500-000000-80-0-0.jpg" },
  { artist: "Danny Brown", album: "Atrocity Exhibition", year: 2016, art: "https://cdn-images.dzcdn.net/images/cover/fccdcc562c0de3c46ca7646001dc52d6/500x500-000000-80-0-0.jpg" },
  { artist: "Pusha T", album: "DAYTONA", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/8285385994596b0be8632d6932d0c642/500x500-000000-80-0-0.jpg" },
  { artist: "Pusha T", album: "It's Almost Dry", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/bc64e73f4f8984f5a32edef379f93d5d/500x500-000000-80-0-0.jpg" },
  { artist: "Clipse", album: "Hell Hath No Fury", year: 2006, art: "https://cdn-images.dzcdn.net/images/cover/e34320f3d85f8d519d1f92eac51d80ed/500x500-000000-80-0-0.jpg" },
  { artist: "Denzel Curry", album: "Taboo", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/c5197378dd001e998f902d8a60e84406/500x500-000000-80-0-0.jpg" },
  { artist: "Denzel Curry", album: "Melt My Eyez See Your Future", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/6f025fe60479db38c5187378a5d3aa03/500x500-000000-80-0-0.jpg" },
  { artist: "Denzel Curry & Kenny Beats", album: "UNLOCKED 1.5", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/bf9164cb894a7c50fb1068068e0e4f57/500x500-000000-80-0-0.jpg" },
  { artist: "Joji", album: "Nectar", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/122fd1b9f6498e9fb8e1c148926a7d55/500x500-000000-80-0-0.jpg" },
  { artist: "Rich Brian", album: "The Sailor", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/483c747fbf99977b204bd73f72c5467c/500x500-000000-80-0-0.jpg" },
  { artist: "Rich Brian", album: "WHERE IS MY HEAD", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/a874c3d227e974a287b0aeba46623dc0/500x500-000000-80-0-0.jpg" },
  { artist: "BROCKHAMPTON", album: "SATURATION II", year: 2017, art: "https://cdn-images.dzcdn.net/images/cover/fd74ea269aa3adb83abb09def135c299/500x500-000000-80-0-0.jpg" },
  { artist: "BROCKHAMPTON", album: "SATURATION III", year: 2017, art: "https://cdn-images.dzcdn.net/images/cover/e1b63b5658caf694027325c9eec6f977/500x500-000000-80-0-0.jpg" },
  { artist: "BROCKHAMPTON", album: "IRIDESCENCE", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/cf3bde136116d5ff53b5e7740c3a32f2/500x500-000000-80-0-0.jpg" },
  { artist: "BROCKHAMPTON", album: "ROADRUNNER: NEW LIGHT NEW MACHINE", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/8c47f5c7b82b727843c2b262752d2bc5/500x500-000000-80-0-0.jpg" },
  { artist: "BROCKHAMPTON", album: "THE FAMILY", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/19d0029e23e945c30a5acd6bdecdb6a3/500x500-000000-80-0-0.jpg" },
  { artist: "Slowthai", album: "UGLY", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/5f735b225d889009ebe4ffb3a49dd0b8/500x500-000000-80-0-0.jpg" },
  { artist: "Slowthai", album: "TYRON", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/8e23eaa72168b4225027aeee20d20346/500x500-000000-80-0-0.jpg" },
  { artist: "Slowthai", album: "Nothing Great About Britain", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/3b1ccdece8ee097357991c50561d3146/500x500-000000-80-0-0.jpg" },
  { artist: "Clairo", album: "Sling", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/4fca2bc6ebaacc930e9bc95a61b31623/500x500-000000-80-0-0.jpg" },
  { artist: "Clairo", album: "Charm", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/6dfa4ea965a74b93870a85daa74b7ca3/500x500-000000-80-0-0.jpg" },
  { artist: "Clairo", album: "Immunity", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/ce9daf5b5d41cf2c8e1076b2a1e07787/500x500-000000-80-0-0.jpg" },
  { artist: "Silk Sonic", album: "An Evening with Silk Sonic", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/faada8a8c545b2e3d454267b55c82e14/500x500-000000-80-0-0.jpg" },
  { artist: "James Blake", album: "Friends That Break Your Heart", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/e894e29db7e12025e20ca652a74cacca/500x500-000000-80-0-0.jpg" },
  { artist: "James Blake", album: "Trying Times", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/5ff79b3810a5036120dab4e546868bb0/500x500-000000-80-0-0.jpg" },
  { artist: "James Blake", album: "Playing Robots into Heaven", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/80aca114a10d2657c2c690dd6240fc75/500x500-000000-80-0-0.jpg" },
  { artist: "Omar Apollo", album: "GOD SAID NO", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/621f7ca71aa3d3a8f52ef5c8195e3290/500x500-000000-80-0-0.jpg" },
  { artist: "Omar Apollo", album: "Ivory", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/25b3ef9310dc698e2a66e96fdb645a90/500x500-000000-80-0-0.jpg" },
  { artist: "Rex Orange County", album: "Who Cares?", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/ba1e7f3702a82b91615689daff474622/500x500-000000-80-0-0.jpg" },
  { artist: "Lana Del Rey", album: "Norman Fucking Rockwell!", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/c0f4f022fa51f13e877aae2e758e241d/500x500-000000-80-0-0.jpg" },
  { artist: "Lana Del Rey", album: "Did You Know That There's a Tunnel Under Ocean Blvd", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/0ae53c84250981214bcb7ca39f8c2195/500x500-000000-80-0-0.jpg" },
  { artist: "Steve Lacy", album: "Gemini Rights", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/3b60918205a5bb30e2b2427714ec3162/500x500-000000-80-0-0.jpg" },
  { artist: "Rina Sawayama", album: "SAWAYAMA", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/88de13781a0b5afdf89261ec1391ac9e/500x500-000000-80-0-0.jpg" },
  { artist: "Rina Sawayama", album: "Hold the Girl", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/361bfbd26cc0fd58ecbd250bf214f64c/500x500-000000-80-0-0.jpg" },
  { artist: "Tkay Maidza", album: "Sweet Justice", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/3737c45ce153ec0a95931e2be1ea8d1a/500x500-000000-80-0-0.jpg" },
  { artist: "Troye Sivan", album: "Something to Give Each Other", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/025b8f193e9cb37b15c857956938ae4f/500x500-000000-80-0-0.jpg" },
  { artist: "Troye Sivan", album: "In a Dream", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/62d476a92c49d09e1c016ed5bbbc29eb/500x500-000000-80-0-0.jpg" },
  { artist: "Ryan Beatty", album: "Sweet Fortune", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/b3a9dee0e68c75a03f059c563f664c83/500x500-000000-80-0-0.jpg" },
  { artist: "Ryan Beatty", album: "Calico", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/610a6f812db4a5891f1cd1f81951d0ca/500x500-000000-80-0-0.jpg" },
  { artist: "Ryan Beatty", album: "Boy in Jeans", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/07ef457e8de3f7078afa9d32f817a7bb/500x500-000000-80-0-0.jpg" },
  { artist: "Japanese Breakfast", album: "Jubilee", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/f0d5207d075adb652643a29ae8851e7b/500x500-000000-80-0-0.jpg" },
  { artist: "boylife", album: "gelato", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/93bf7e9eda53e699e33e33f37df73861/500x500-000000-80-0-0.jpg" },
  { artist: "boylife", album: "jones", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/d5500802627506bed91d11265c90cd74/500x500-000000-80-0-0.jpg" },
  { artist: "Conan Gray", album: "Found Heaven", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/7f072d95dc76bd8996bdf9dbe31f834d/500x500-000000-80-0-0.jpg" },
  { artist: "Conan Gray", album: "Wishbone", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/a827e769491a705534261902c17af3fb/500x500-000000-80-0-0.jpg" },
  { artist: "Conan Gray", album: "Superache", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/a3c9e93717168c47053e7e02edbb919c/500x500-000000-80-0-0.jpg" },
  { artist: "Conan Gray", album: "Kid Krow", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/5ce766122169a6dfab32ffdcea52fb7a/500x500-000000-80-0-0.jpg" },
  { artist: "Charli XCX", album: "how i'm feeling now", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/f2315bc78a1049916d387cd23feeb3ee/500x500-000000-80-0-0.jpg" },
  { artist: "Charli XCX", album: "BRAT", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/de9e79511cda59914de9add50946e43c/500x500-000000-80-0-0.jpg" },
  { artist: "Matt Champion", album: "mika's laundry", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/cdc758b325516a53bd6fd306b9320071/500x500-000000-80-0-0.jpg" },
  { artist: "Kali Uchis", album: "Orquídeas", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/8d3d381fbab70fd048b26d6f40132af9/500x500-000000-80-0-0.jpg" },
  { artist: "Kali Uchis", album: "Red Moon in Venus", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/1944216ac44945f39535a5cf64bfbcbf/500x500-000000-80-0-0.jpg" },
  { artist: "Kali Uchis", album: "Sincerely", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/6365bd829ef4df4f545c818f06dbbd58/500x500-000000-80-0-0.jpg" },
  { artist: "Justice", album: "Hyperdrama", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/488973700496ca712df8899028883682/500x500-000000-80-0-0.jpg" },
  { artist: "Chappell Roan", album: "The Rise and Fall of a Midwest Princess", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/71486ce8b24f612c4887efa0f79a9f66/500x500-000000-80-0-0.jpg" },
  { artist: "Rosalía", album: "MOTOMAMI", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/c9f9dbb45882f60cdcd4d66953aeaed7/500x500-000000-80-0-0.jpg" },
  { artist: "Jean Dawson", album: "GLIMMER OF GOD", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/36cac95669599584ae51962989f3dcc2/500x500-000000-80-0-0.jpg" },
  { artist: "Jean Dawson", album: "PIXEL BATH", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/449fff2afdac47005756c609d660fd6e/500x500-000000-80-0-0.jpg" },
  { artist: "Roy Blair", album: "Chasing Moving Trains", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/96bc34ffe0abdc2114ac8686b6bfb775/500x500-000000-80-0-0.jpg" },
  { artist: "Little Simz", album: "LOTUS", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/d28d8c3998126186ca91667f6b06352f/500x500-000000-80-0-0.jpg" },
  { artist: "Little Simz", album: "Sometimes I Might Be Introvert", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/885b9bd8ed06098c8eddee790b81bca4/500x500-000000-80-0-0.jpg" },
  { artist: "Little Simz", album: "No Thank You", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/853ec53d2c47f7c0170530db2ccc9353/500x500-000000-80-0-0.jpg" },
  { artist: "Bad Bunny", album: "Debí Tirar Más Fotos", year: 2025, art: "https://cdn-images.dzcdn.net/images/cover/d98eaccfbb945bdf68241d6de7fe6a49/500x500-000000-80-0-0.jpg" },
  { artist: "Bad Bunny", album: "Nadie Sabe Lo Que Va a Pasar Mañana", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/f840891b70f6e240b8ecaec49346bd6a/500x500-000000-80-0-0.jpg" },
  { artist: "Kevin Abstract", album: "BLUSH", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/2da3adceb725caf8682dae615e3bcdc8/500x500-000000-80-0-0.jpg" },
  { artist: "underscores", album: "Underscores", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/2b7ebf336f61c1aca52c0bfec0a4b30e/500x500-000000-80-0-0.jpg" },
  { artist: "Fcukers", album: "O", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/1b2ea7644705dbc15e2c6aef274f0adb/500x500-000000-80-0-0.jpg" },
  { artist: "ninajirachi", album: "I Love My Computer", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/04dc7549927b479188a1af4092dc1e86/500x500-000000-80-0-0.jpg" },
  { artist: "Tiffany Day", album: "Halo", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/b12db87a28112199b7ca7273afefee79/500x500-000000-80-0-0.jpg" },
  { artist: "Tinashe", album: "POPSTAR", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/562036c5d7129b7e917e3d444d6d4930/500x500-000000-80-0-0.jpg" },
  { artist: "By Storm", album: "My Ghosts Go Ghost", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/d3bcfd14e834207f8aa86ef8e63607a2/500x500-000000-80-0-0.jpg" },
  { artist: "Injury Reserve", album: "By the Time I Get to Phoenix", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/972248f8bf9a742504e32dde87468a1d/500x500-000000-80-0-0.jpg" },
  { artist: "Kacey Musgraves", album: "Same Trailer Different Park", year: 2013, art: "https://cdn-images.dzcdn.net/images/cover/0597795cd40eaff3b1b39b6e77f44aab/500x500-000000-80-0-0.jpg" },
  { artist: "Baby Keem", album: "Casino", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/8fb0186b9e021f66f1d970db709d2e2c/500x500-000000-80-0-0.jpg" },
  { artist: "Baby Keem", album: "The Melodic Blue", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/dd16b460f4bc1bac90b7a020591a47ed/500x500-000000-80-0-0.jpg" },
  { artist: "Olivia Rodrigo", album: "GUTS", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/a556f7f5fb3efeedb984ad5951f38f21/500x500-000000-80-0-0.jpg" },
  { artist: "Olivia Rodrigo", album: "SOUR", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/e68da86fd7976135c2d2d1715afaef7c/500x500-000000-80-0-0.jpg" },
  { artist: "Slayyyter", album: "Troubled Paradise", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/d365898c27e6340ab1629e02a1298e36/500x500-000000-80-0-0.jpg" },
  { artist: "Slayyyter", album: "STARFUCKER", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/50d3879525565a6c69e184869f04ef2e/500x500-000000-80-0-0.jpg" },
  { artist: "Slayyyter", album: "WOR$T GIRL IN AMERICA", year: 2025, art: "https://cdn-images.dzcdn.net/images/cover/9b717d3011fd7ce7f7206c110a624536/500x500-000000-80-0-0.jpg" },
  { artist: "Quadeca", album: "SCRAPYARD", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/eb98015af2e4c712a4cf315e27b8baa1/500x500-000000-80-0-0.jpg" },
  { artist: "Remi Wolf", album: "Big Ideas", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/77921e3f12f4e54d94fbb6a5d572eae0/500x500-000000-80-0-0.jpg" },
  { artist: "Remi Wolf", album: "Mud", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/32a387a575b7b25cfbe4a52571092d91/500x500-000000-80-0-0.jpg" },
  { artist: "Gesaffelstein", album: "Gamma", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/8a402d79b24b4839b0a51ae98ce13b73/500x500-000000-80-0-0.jpg" },
  { artist: "Action Bronson", album: "COCODRILLO TURBO", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/4cff49b67247db8da504bfcd1135ea84/500x500-000000-80-0-0.jpg" },
  { artist: "Vince Staples", album: "Ramona Park Broke My Heart", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/424dbe28d0d2f644f9c6e3feb092cd30/500x500-000000-80-0-0.jpg" },
  { artist: "Kevin Abstract", album: "Arizona Baby", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/dfecc89eb01548eb7894d4bf783b241c/500x500-000000-80-0-0.jpg" },
  { artist: "Billie Eilish", album: "HIT ME HARD AND SOFT", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/5d284b31cb9ddeb1a0c79aede5a94e1c/500x500-000000-80-0-0.jpg" },
  { artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP WHERE DO WE GO", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/6630083f454d48eadb6a9b53f035d734/500x500-000000-80-0-0.jpg" },
  { artist: "Magdalena Bay", album: "Imaginal Disk", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/9bf3fef533c09d8d2423883186cabc60/500x500-000000-80-0-0.jpg" },
  { artist: "Sampha", album: "Lahai", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/ba7baa737fe4f9110d26fdec3d2d0105/500x500-000000-80-0-0.jpg" },
  { artist: "ASAP Rocky", album: "Don't Be Dumb", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/1b12a3693578183b0ece3544133f41ad/500x500-000000-80-0-0.jpg" },
  { artist: "Chance the Rapper", album: "10 Day", year: 2012, art: "https://cdn-images.dzcdn.net/images/cover/d0700a2d8822f0a5a165d98af8878799/500x500-000000-80-0-0.jpg" },
  { artist: "Chance the Rapper", album: "Acid Rap", year: 2013, art: "https://cdn-images.dzcdn.net/images/cover/99e66d569d9d48717e93592c72feaa5d/500x500-000000-80-0-0.jpg" },
  { artist: "Chance the Rapper", album: "Coloring Book", year: 2016, art: "https://cdn-images.dzcdn.net/images/cover/c470f26b3730f6dbede95bc17ba827bd/500x500-000000-80-0-0.jpg" },
  { artist: "Daniel Caesar", album: "Freudian", year: 2017, art: "https://cdn-images.dzcdn.net/images/cover/282e45bef1995c2c6f2901e34c4ab560/500x500-000000-80-0-0.jpg" },
  { artist: "Joey Bada$$", album: "1999", year: 2012, art: "https://cdn-images.dzcdn.net/images/cover/1a78ec1b3cd5e771cf56f2f18f3da22f/500x500-000000-80-0-0.jpg" },
  { artist: "Joey Bada$$", album: "2000", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/f40cbd4b6b78da9c5f016e2bd96e8163/500x500-000000-80-0-0.jpg" },
  { artist: "Joey Bada$$", album: "All-AmeriKKKan Bada$$", year: 2017, art: "https://cdn-images.dzcdn.net/images/cover/100f88420650db8f804b4bedb08fcadd/500x500-000000-80-0-0.jpg" },
  { artist: "Joey Bada$$", album: "Lonely at the Top", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/35b38d413278dbc48cc098ea333a1d73/500x500-000000-80-0-0.jpg" },
  { artist: "Anderson .Paak", album: "Malibu", year: 2016, art: "https://cdn-images.dzcdn.net/images/cover/dc2fac96693ccae66ea8e0a43069c716/500x500-000000-80-0-0.jpg" },
  { artist: "Anderson .Paak", album: "Oxnard", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/48eebe922e8560724795f645e02fa6a3/500x500-000000-80-0-0.jpg" },
  { artist: "redveil", album: "pg baby", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/22c2fa4e947d24ab5e9960aa714098a2/500x500-000000-80-0-0.jpg" },
  { artist: "redveil", album: "learn 2 swim", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/58c812c37f81461ccc439beaf2c01905/500x500-000000-80-0-0.jpg" },
  { artist: "Freddie Gibbs", album: "Freddie", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/0ba3517aa3287c037ff24485a2d6ae49/500x500-000000-80-0-0.jpg" },
  { artist: "Freddie Gibbs & The Alchemist", album: "Alfredo", year: 2020, art: "https://cdn-images.dzcdn.net/images/cover/baff641d3a01c0d8b782e3340775eae0/500x500-000000-80-0-0.jpg" },
  { artist: "Olivia Dean", album: "Messy", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/0f3f905b35a640121180f26a422dcfd7/500x500-000000-80-0-0.jpg" },
  { artist: "Olivia Dean", album: "The Art of Loving", year: 2025, art: "https://cdn-images.dzcdn.net/images/cover/b7aaad0f696b5dbfe7f1ebf2c72346a5/500x500-000000-80-0-0.jpg" },
  { artist: "JID", album: "The Forever Story", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/52c49df999ccf2844238672acccf2b7b/500x500-000000-80-0-0.jpg" },
  { artist: "JID", album: "DiCaprio 2", year: 2018, art: "https://cdn-images.dzcdn.net/images/cover/488ca38af2bce52954ff6e0d9296592f/500x500-000000-80-0-0.jpg" },
  { artist: "JID", album: "LUDS", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/a9de1521f192e1dbb0afccff0c4b0c20/500x500-000000-80-0-0.jpg" },
  { artist: "Young Thug", album: "Jeffery", year: 2016, art: "https://cdn-images.dzcdn.net/images/cover/bc5cf2886a938c630606f1544ae617d3/500x500-000000-80-0-0.jpg" },
  { artist: "Young Thug", album: "So Much Fun", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/8f75b9fa32fae8f4d3177740d99de3ed/500x500-000000-80-0-0.jpg" },
  { artist: "Future", album: "Monster", year: 2014, art: "https://cdn-images.dzcdn.net/images/cover/c0ef1982147f851187ef4aa3a0c06470/500x500-000000-80-0-0.jpg" },
  { artist: "Future", album: "DS2", year: 2015, art: "https://cdn-images.dzcdn.net/images/cover/865cd8c71b697175d6eb271ac66cbf1d/500x500-000000-80-0-0.jpg" },
  { artist: "Future", album: "I Never Liked You", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/d1bd3da6698dd5eafc5b4514317039c4/500x500-000000-80-0-0.jpg" },
  { artist: "Future & Metro Boomin", album: "We Don't Trust You", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/2d20cf6d65607e406213afbb3b62ce0d/500x500-000000-80-0-0.jpg" },
  { artist: "Future", album: "FUTURE", year: 2017, art: "https://cdn-images.dzcdn.net/images/cover/5186078c5bd5623ebec9b2753d8aaebe/500x500-000000-80-0-0.jpg" },
  { artist: "Future", album: "HNDRXX", year: 2017, art: "https://cdn-images.dzcdn.net/images/cover/bf48c4a628e2f4e92f80dff32275a237/500x500-000000-80-0-0.jpg" },
  { artist: "Drake & Future", album: "What a Time to Be Alive", year: 2015, art: "https://cdn-images.dzcdn.net/images/cover/b58feddf14dd25f87bf82c56fdf2683c/500x500-000000-80-0-0.jpg" },
  { artist: "Doja Cat", album: "Scarlet", year: 2023, art: "https://cdn-images.dzcdn.net/images/cover/57ea185ecde0635f7b02f245b9d67c96/500x500-000000-80-0-0.jpg" },
  { artist: "Doja Cat", album: "Planet Her", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/1e012b5bba83edac911b09ca1ab29e1e/500x500-000000-80-0-0.jpg" },
  { artist: "Rico Nasty", album: "Anger Management", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/d6ea43d1552bb6b4a54eca88913f9643/500x500-000000-80-0-0.jpg" },
  { artist: "Isaiah Rashad", album: "The House Is Burning", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/cd1cd67069ac9c1e0eb72309636b5563/500x500-000000-80-0-0.jpg" },
  { artist: "Isaiah Rashad", album: "Cilvia Demo", year: 2014, art: "https://cdn-images.dzcdn.net/images/cover/a6b8800f66eec10a1be11cfcc4e4ea1e/500x500-000000-80-0-0.jpg" },
  { artist: "Dijon", album: "Absolutely", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/d6761ca2c8d99b2153f4c4cb8abb3d4f/500x500-000000-80-0-0.jpg" },
  { artist: "Dijon", album: "Baby", year: 2019, art: "https://cdn-images.dzcdn.net/images/cover/59580cf37c2182da329172cc1a79af41/500x500-000000-80-0-0.jpg" },
  { artist: "Machine Girl", album: "MG Ultra", year: 2022, art: "https://cdn-images.dzcdn.net/images/cover/310a1420b087e65e3194b444b9ea99d9/500x500-000000-80-0-0.jpg" },
  { artist: "Pink Pantheress", album: "Fancy That", year: 2024, art: "https://cdn-images.dzcdn.net/images/cover/0b8720478ef28aedf91af614d36721ec/500x500-000000-80-0-0.jpg" },
  { artist: "Lil Nas X", album: "MONTERO", year: 2021, art: "https://cdn-images.dzcdn.net/images/cover/18e6daf0a1c70c1346c44670ff70645d/500x500-000000-80-0-0.jpg" },
  { artist: "Death Grips", album: "The Money Store", year: 2012, art: "https://cdn-images.dzcdn.net/images/cover/8bc4926f2361aec49ce613f9f5844998/500x500-000000-80-0-0.jpg" },
];

function albumHTML(album) {
  const title  = escHtml(album.title  || 'Unknown Album');
  const artist = escHtml(album.artist || 'Unknown Artist');
  const art    = /^https:\/\//.test(album.artwork || '') ? album.artwork : '';
  return `
    <div class="album-card">
      <div class="album-art-box">
        ${art ? `<img class="album-art" src="${art}" alt="" loading="lazy" onload="this.classList.add('loaded')" onerror="this.style.display='none'">` : ''}
      </div>
      <div class="album-info">
        <span class="album-artist">${artist}</span>
        <span class="album-title">${title}</span>
      </div>
    </div>`;
}

async function loadGenre(genreId) {
  const container = document.getElementById(`albums-${genreId}`);
  container.innerHTML = '<div class="skeleton-card"></div><div class="skeleton-card"></div><div class="skeleton-card"></div>';
  try {
    const res = await fetch(`${API_BASE}/api/music?genre=${genreId}&source=${musicSource}`);
    if (!res.ok) throw new Error(res.status);
    const { albums } = await res.json();
    container.innerHTML = albums.slice(0, 9).map(a => albumHTML(a)).join('');
  } catch {
    container.innerHTML = '<div class="empty-msg">Could not load</div>';
  }
}

const GENRES_HTML = document.querySelector('.genres-wrap').innerHTML;

function loadMusic() {
  if (musicSource === 'faves') {
    loadFaves();
    return;
  }
  const wrap = document.querySelector('.genres-wrap');
  if (!wrap.querySelector('.genre-section')) wrap.innerHTML = GENRES_HTML;
  ['pop', 'hiphop', 'alternative'].forEach(loadGenre);
}

function loadFaves() {
  const withArt = FAVES.filter(f => f.art);
  const dayIdx = Math.floor(Date.now() / 86400000) % withArt.length;
  const featured = withArt[dayIdx];

  document.querySelector('.genres-wrap').innerHTML = `
    <div class="faves-featured">
      <div class="faves-art-box">
        <img class="faves-art" src="${featured.art}" alt="${featured.album}">
      </div>
      <div class="faves-info">
        <div class="faves-artist">${featured.artist}</div>
        <div class="faves-album">${featured.album}</div>
        <div class="faves-year">${featured.year}</div>
      </div>
    </div>`;
}

function initToggle() {
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.source === musicSource) return;
      musicSource = btn.dataset.source;
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const label = { charts: 'Trending', new: 'New Releases', faves: 'Album of the Day' };
      document.getElementById('music-section-label').textContent = label[musicSource];
      loadMusic();
    });
  });
}

/* ── Calendar ───────────────────────────────────────────────── */

function getEaster(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day   = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function nthMonday(year, month, n) {
  const d = new Date(year, month, 1);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  d.setDate(d.getDate() + (n - 1) * 7);
  return d;
}

function getCanadianHolidays(year) {
  const h = {};
  h[`${year}-01-01`] = "New Year's Day";

  const easter = getEaster(year);
  const gf = new Date(easter); gf.setDate(easter.getDate() - 2);
  const em = new Date(easter); em.setDate(easter.getDate() + 1);
  h[isoDate(gf)] = 'Good Friday';
  h[isoDate(em)] = 'Easter Monday';

  // Victoria Day: last Monday on or before May 24
  const may24 = new Date(year, 4, 24);
  while (may24.getDay() !== 1) may24.setDate(may24.getDate() - 1);
  h[isoDate(may24)] = 'Victoria Day';

  h[`${year}-07-01`] = 'Canada Day';

  // Labour Day: first Monday of September
  h[isoDate(nthMonday(year, 8, 1))] = 'Labour Day';

  // Thanksgiving: second Monday of October
  h[isoDate(nthMonday(year, 9, 2))] = 'Thanksgiving';

  h[`${year}-11-11`] = 'Remembrance Day';
  h[`${year}-12-25`] = 'Christmas Day';
  h[`${year}-12-26`] = 'Boxing Day';
  return h;
}

let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();

function renderCalendar() {
  const container = document.getElementById('calendar-grid');
  const today      = new Date();
  const todayYear  = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate  = today.getDate();

  const holidays    = getCanadianHolidays(calYear);
  const firstDow    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthPrefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-`;

  document.getElementById('cal-section-label').textContent = `${MONTHS[calMonth]} ${calYear}`;

  let headers = '<div class="cal-headers">';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
    headers += `<div class="cal-day-header">${d}</div>`;
  });
  headers += '</div>';

  let grid = '<div class="cal-grid">';
  for (let i = 0; i < firstDow; i++) grid += '<div class="cal-cell"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const key = monthPrefix + String(d).padStart(2, '0');
    const dow = new Date(calYear, calMonth, d).getDay();
    let cls = 'cal-cell';
    if (calYear === todayYear && calMonth === todayMonth && d === todayDate) cls += ' cal-today';
    if (holidays[key]) cls += ' cal-holiday';
    if (dow === 0 || dow === 6) cls += ' cal-weekend';
    grid += `<div class="${cls}"><span class="cal-day-num">${d}</span>${holidays[key] ? `<span class="cal-holiday-name">${holidays[key]}</span>` : ''}</div>`;
  }
  grid += '</div>';

  container.innerHTML = headers + grid;
}

function initCalNav() {
  document.getElementById('cal-prev').addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar();
  });
  document.getElementById('cal-section-label').addEventListener('click', () => {
    const now = new Date();
    calYear = now.getFullYear(); calMonth = now.getMonth();
    renderCalendar();
  });
}

/* ── Weather ────────────────────────────────────────────────── */
const WMO = {
  0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Foggy',
  51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow',
  80: 'Showers', 81: 'Showers', 82: 'Heavy Showers',
  85: 'Snow Showers', 86: 'Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
};

async function loadWeather() {
  const el = document.getElementById('weather');
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=43.6532&longitude=-79.3832&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=celsius&timezone=America%2FToronto&forecast_days=5'
    );
    if (!res.ok) throw new Error(res.status);
    const { daily } = await res.json();
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    el.innerHTML = daily.time.slice(0, 5).map((dateStr, i) => {
      const label = i === 0 ? 'Today' : days[new Date(dateStr + 'T12:00:00').getDay()];
      const hi    = Math.round(daily.temperature_2m_max[i]);
      const lo    = Math.round(daily.temperature_2m_min[i]);
      const cond  = WMO[daily.weathercode[i]] || '';
      const cls = i === 0 ? 'forecast-day forecast-today' : 'forecast-day';
      return `<div class="${cls}">
        <span class="forecast-label">${label}</span>
        <span class="forecast-temps">${hi}° / ${lo}°</span>
        <span class="forecast-cond">${cond}</span>
      </div>`;
    }).join('');
  } catch {
    el.textContent = '';
  }
}

/* ── Init ───────────────────────────────────────────────────── */
loadMusic();
loadWeather();
renderCalendar();
initToggle();
initCalNav();

setInterval(loadMusic, 60 * 60 * 1000);
setInterval(loadWeather, 15 * 60 * 1000);

// Re-render calendar at midnight in case month rolls over
function scheduleCalendarRefresh() {
  const now = new Date();
  const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
  setTimeout(() => {
    const now = new Date();
    calYear = now.getFullYear(); calMonth = now.getMonth();
    renderCalendar();
    scheduleCalendarRefresh();
  }, msUntilMidnight);
}
scheduleCalendarRefresh();

// Full page reload once a day at midnight as a safety net
(function scheduleReload() {
  const now = new Date();
  const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
  setTimeout(() => location.reload(), msUntilMidnight);
})();

/* ── Inactivity dim ─────────────────────────────────────────── */
(function initDim() {
  const DIM_AFTER = 5 * 60 * 1000;
  const overlay = document.createElement('div');
  overlay.id = 'dim-overlay';
  document.body.appendChild(overlay);

  let timer;
  function resetTimer() {
    clearTimeout(timer);
    overlay.classList.remove('dim-active');
    timer = setTimeout(() => overlay.classList.add('dim-active'), DIM_AFTER);
  }

  ['touchstart', 'touchmove', 'click', 'mousemove', 'keydown'].forEach(e =>
    document.addEventListener(e, resetTimer, { passive: true })
  );
  resetTimer();
})();

/* ── Utils ──────────────────────────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
