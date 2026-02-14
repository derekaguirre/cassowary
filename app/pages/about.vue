<template>
  <section class="flex justify-between items-center mb-5">
    <h1 class="font-extrabold text-4xl">Cassowary : Wuthering Waves Planner</h1>
  </section>
  <div className="about-page">
    <div className="design-section">
      <div>
        <h2 class="font-extrabold text-md">Design</h2>
        <p>
          Prelimiary design of the planner is a 1-dimensional layout. Users are
          able to select a dropdown of characters/weapons as well as directly
          select the target level ranges of levels to plan.
        </p>
      </div>
    </div>

    <br />
    <br />

    <div className="features-section">
      <div className="implemented-features">
        <h2 class="font-extrabold text-md">Implemented</h2>
        <ul>
          <li>- Basic manual notes system to track events or tasks</li>
        </ul>
      </div>
      <div className="planned-features">
        <h2 class="font-extrabold text-md">Planned Features</h2>
        <ul>
          <li>
            - character/weapon page: show current item needed and global item
            needed
          </li>
          <li>
            - Improve xp materials to be calc'd similar to tiered materials
          </li>
          <li>- add backup and restore local storage data</li>
          <li>- sort by in-game: sort by rarity, category? a-z?</li>
          <li>
            - Add time per waveplate cost/convert waveplate to days and display
            time per goal and total days (double, not int)
          </li>
          <li>- Filtering by element, weapon type, rarity</li>
          <li>- try google drive client api if it's actually possible</li>
          <li>- Multiple accounts</li>
          <li>
            - Button and Modal for adding Characters/Weapons which would allow
            for custom characters as well
          </li>
          <li>
            - Calculate real time cost of specified materials if applicable
          </li>
          <li>- Allow for buttons to auto craft and deduct lesser materials</li>
          <li>- New notes system that allows recurring events and timers</li>
        </ul>
      </div>

      <div className="planned-fixes">
        <h2 class="font-extrabold text-md">Planned fixes</h2>
        <ul>
          <li>- fix navbar appearing on the footer</li>
          <li>- Add all tiers of weapons</li>
        </ul>
      </div>
    </div>

    <br />
    <br />

    <div class="trivia-section">
      <h2 class="font-extrabold text-md">Random Trivia</h2>
      <ul>
        <li>- char_exp : credit_to_level = 1 : 0.35</li>
        <li>- weapon_exp : credit_to_level = 1 : 0.4</li>
        <li>
          - to level 5-star echo from 1 to 25, you need around 29 Premium Sealed
          Tube
        </li>
        <li>
          - at sol3 rank 6, each run at tacet field you can get at least 3
          Premium Sealed Tube and 3 Advanced Sealed Tube, which is valued as 1.2
          Premium Sealed Tube, so total is 4.2 Premium Sealed Tube. (if lucky
          you can get 4-4). so you need to do 7 runs to get 29 Premium Sealed
          Tube. 7 runs = 420 energy = 1.75 days = 4x a week. each run also gives
          20 premium tuner
        </li>
        <li>
          - need 50 tuner to 5x tune 1 echo. so you need to do 2.5 runs to get
          50 tuner
        </li>
        <li>
          - 2.5 runs = 150 energy = 0.625 days = 11.2x a week. so in a week you
          can level at least 4 echoes and max tune 11 echoes
        </li>
      </ul>
    </div>

    <br />
    <br />

    <div className="contact-section">
      <h2 class="font-extrabold text-md">Contact</h2>
      <div>
        If you find any bugs or have some suggestions, please create issue on
        the repository https://github.com/derekaguirre/cassowary.
      </div>
      <div>
        Thanks to seelie.me for the inspiration and to boxofzero for starting
        this project to allow planning for wuthering waves.
      </div>
      <div>
        Thanks to wutheringwaves.gg, dim's wutheringdata, encore.moe, and
        wutheringtools.com for all the data
      </div>
    </div>

    <br />
    <br />
  </div>

  <div className="disclaimer-section">
    <h2 class="font-extrabold text-md">Disclaimer</h2>
    <div>
      This site is not affiliated with KURO GAMES. Wuthering Waves and all of
      its assets belong to KURO GAMES.
    </div>
  </div>
</template>

<script setup></script>
