/* =============================================
   ANCFC - All Nations Christian Fellowship Church
   JavaScript - Navigation, Scroll, Animations
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Navbar Scroll Effect ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Scroll Reveal Animation ---
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add fade-in class to elements
  const animateElements = document.querySelectorAll(
    '.section-header, .about-text, .about-values, .value-card, ' +
    '.leader-feature, .service-card, .ministry-card, .give-card, ' +
    '.message-layout, .contact-info, .contact-form-wrap, ' +
    '.couple-banner-text, .connect-inner, .give-text, .campaign-image, .campaign-stats, .campaign-actions'
  );

  animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.querySelectorAll('a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // --- Parallax Hero Effect ---
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
      }
    });
  }

  // --- Form Submission Feedback ---
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = '( Sending... )';
      btn.disabled = true;

      // Re-enable after a timeout in case of error
      setTimeout(() => {
        btn.textContent = '( Send Message )';
        btn.disabled = false;
      }, 5000);
    });
  }

  // --- Discipleship Sign-Up Form (AJAX submit to Formspree) ---
  const signupForm = document.querySelector('.signup-form');
  if (signupForm) {
    const status = signupForm.querySelector('.signup-form-status');
    const submitBtn = signupForm.querySelector('button[type="submit"]');

    // [name, ISO-3166 alpha-2, dialing code]
    const COUNTRY_DATA = [
      ['Afghanistan','AF','93'],['Albania','AL','355'],['Algeria','DZ','213'],['Andorra','AD','376'],
      ['Angola','AO','244'],['Antigua and Barbuda','AG','1268'],['Argentina','AR','54'],['Armenia','AM','374'],
      ['Australia','AU','61'],['Austria','AT','43'],['Azerbaijan','AZ','994'],['Bahamas','BS','1242'],
      ['Bahrain','BH','973'],['Bangladesh','BD','880'],['Barbados','BB','1246'],['Belarus','BY','375'],
      ['Belgium','BE','32'],['Belize','BZ','501'],['Benin','BJ','229'],['Bhutan','BT','975'],
      ['Bolivia','BO','591'],['Bosnia and Herzegovina','BA','387'],['Botswana','BW','267'],['Brazil','BR','55'],
      ['Brunei','BN','673'],['Bulgaria','BG','359'],['Burkina Faso','BF','226'],['Burundi','BI','257'],
      ['Cabo Verde','CV','238'],['Cambodia','KH','855'],['Cameroon','CM','237'],['Canada','CA','1'],
      ['Central African Republic','CF','236'],['Chad','TD','235'],['Chile','CL','56'],['China','CN','86'],
      ['Colombia','CO','57'],['Comoros','KM','269'],['Congo (Republic)','CG','242'],['Congo (DRC)','CD','243'],
      ['Costa Rica','CR','506'],["Cote d'Ivoire",'CI','225'],['Croatia','HR','385'],['Cuba','CU','53'],
      ['Cyprus','CY','357'],['Czechia','CZ','420'],['Denmark','DK','45'],['Djibouti','DJ','253'],
      ['Dominica','DM','1767'],['Dominican Republic','DO','1809'],['Ecuador','EC','593'],['Egypt','EG','20'],
      ['El Salvador','SV','503'],['Equatorial Guinea','GQ','240'],['Eritrea','ER','291'],['Estonia','EE','372'],
      ['Eswatini','SZ','268'],['Ethiopia','ET','251'],['Fiji','FJ','679'],['Finland','FI','358'],
      ['France','FR','33'],['Gabon','GA','241'],['Gambia','GM','220'],['Georgia','GE','995'],
      ['Germany','DE','49'],['Ghana','GH','233'],['Greece','GR','30'],['Grenada','GD','1473'],
      ['Guatemala','GT','502'],['Guinea','GN','224'],['Guinea-Bissau','GW','245'],['Guyana','GY','592'],
      ['Haiti','HT','509'],['Honduras','HN','504'],['Hungary','HU','36'],['Iceland','IS','354'],
      ['India','IN','91'],['Indonesia','ID','62'],['Iran','IR','98'],['Iraq','IQ','964'],
      ['Ireland','IE','353'],['Israel','IL','972'],['Italy','IT','39'],['Jamaica','JM','1876'],
      ['Japan','JP','81'],['Jordan','JO','962'],['Kazakhstan','KZ','7'],['Kenya','KE','254'],
      ['Kiribati','KI','686'],['Kuwait','KW','965'],['Kyrgyzstan','KG','996'],['Laos','LA','856'],
      ['Latvia','LV','371'],['Lebanon','LB','961'],['Lesotho','LS','266'],['Liberia','LR','231'],
      ['Libya','LY','218'],['Liechtenstein','LI','423'],['Lithuania','LT','370'],['Luxembourg','LU','352'],
      ['Madagascar','MG','261'],['Malawi','MW','265'],['Malaysia','MY','60'],['Maldives','MV','960'],
      ['Mali','ML','223'],['Malta','MT','356'],['Marshall Islands','MH','692'],['Mauritania','MR','222'],
      ['Mauritius','MU','230'],['Mexico','MX','52'],['Micronesia','FM','691'],['Moldova','MD','373'],
      ['Monaco','MC','377'],['Mongolia','MN','976'],['Montenegro','ME','382'],['Morocco','MA','212'],
      ['Mozambique','MZ','258'],['Myanmar','MM','95'],['Namibia','NA','264'],['Nauru','NR','674'],
      ['Nepal','NP','977'],['Netherlands','NL','31'],['New Zealand','NZ','64'],['Nicaragua','NI','505'],
      ['Niger','NE','227'],['Nigeria','NG','234'],['North Korea','KP','850'],['North Macedonia','MK','389'],
      ['Norway','NO','47'],['Oman','OM','968'],['Pakistan','PK','92'],['Palau','PW','680'],
      ['Palestine','PS','970'],['Panama','PA','507'],['Papua New Guinea','PG','675'],['Paraguay','PY','595'],
      ['Peru','PE','51'],['Philippines','PH','63'],['Poland','PL','48'],['Portugal','PT','351'],
      ['Qatar','QA','974'],['Romania','RO','40'],['Russia','RU','7'],['Rwanda','RW','250'],
      ['Saint Kitts and Nevis','KN','1869'],['Saint Lucia','LC','1758'],['Saint Vincent and the Grenadines','VC','1784'],
      ['Samoa','WS','685'],['San Marino','SM','378'],['Sao Tome and Principe','ST','239'],['Saudi Arabia','SA','966'],
      ['Senegal','SN','221'],['Serbia','RS','381'],['Seychelles','SC','248'],['Sierra Leone','SL','232'],
      ['Singapore','SG','65'],['Slovakia','SK','421'],['Slovenia','SI','386'],['Solomon Islands','SB','677'],
      ['Somalia','SO','252'],['South Africa','ZA','27'],['South Korea','KR','82'],['South Sudan','SS','211'],
      ['Spain','ES','34'],['Sri Lanka','LK','94'],['Sudan','SD','249'],['Suriname','SR','597'],
      ['Sweden','SE','46'],['Switzerland','CH','41'],['Syria','SY','963'],['Taiwan','TW','886'],
      ['Tajikistan','TJ','992'],['Tanzania','TZ','255'],['Thailand','TH','66'],['Timor-Leste','TL','670'],
      ['Togo','TG','228'],['Tonga','TO','676'],['Trinidad and Tobago','TT','1868'],['Tunisia','TN','216'],
      ['Turkey','TR','90'],['Turkmenistan','TM','993'],['Tuvalu','TV','688'],['Uganda','UG','256'],
      ['Ukraine','UA','380'],['United Arab Emirates','AE','971'],['United Kingdom','GB','44'],['United States','US','1'],
      ['Uruguay','UY','598'],['Uzbekistan','UZ','998'],['Vanuatu','VU','678'],['Vatican City','VA','379'],
      ['Venezuela','VE','58'],['Vietnam','VN','84'],['Yemen','YE','967'],['Zambia','ZM','260'],
      ['Zimbabwe','ZW','263']
    ];

    const flagEmoji = iso => iso.replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
    const sorted = COUNTRY_DATA.slice().sort((a, b) => a[0].localeCompare(b[0]));

    // Country dropdown
    const countrySelect = signupForm.querySelector('#country');
    if (countrySelect) {
      sorted.forEach(([name, iso]) => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = `${flagEmoji(iso)}  ${name}`;
        countrySelect.appendChild(opt);
      });
    }

    // Phone dialing-code dropdown
    const codeSelect = signupForm.querySelector('#phone_country_code');
    if (codeSelect) {
      sorted.forEach(([name, iso, dial]) => {
        const opt = document.createElement('option');
        opt.value = `+${dial}`;
        opt.textContent = `${flagEmoji(iso)} +${dial}`;
        opt.title = name;
        if (iso === 'US') opt.selected = true;
        codeSelect.appendChild(opt);
      });
    }

    // Phone input: digits only, max 10
    const phoneInput = signupForm.querySelector('#phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        const cleaned = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        if (cleaned !== phoneInput.value) phoneInput.value = cleaned;
      });
    }

    signupForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      submitBtn.textContent = '( Submitting... )';
      submitBtn.disabled = true;
      status.textContent = '';
      status.className = 'signup-form-status';

      try {
        const response = await fetch(signupForm.action, {
          method: 'POST',
          body: new FormData(signupForm),
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          signupForm.reset();
          status.textContent = 'Thank you for signing up. A discipleship leader will follow up with you soon.';
          status.classList.add('is-success');
          submitBtn.textContent = '( Submitted )';
          status.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          const data = await response.json().catch(() => ({}));
          const msg = data.errors ? data.errors.map(err => err.message).join(', ') : 'Something went wrong. Please try again.';
          status.textContent = msg;
          status.classList.add('is-error');
          submitBtn.textContent = '( Submit Sign-Up )';
          submitBtn.disabled = false;
        }
      } catch (err) {
        status.textContent = 'Network error. Please check your connection and try again.';
        status.classList.add('is-error');
        submitBtn.textContent = '( Submit Sign-Up )';
        submitBtn.disabled = false;
      }
    });
  }

  // --- Duplicate marquee text for seamless loop ---
  const marquee = document.querySelector('.mission-marquee');
  if (marquee) {
    const text = marquee.innerHTML;
    marquee.innerHTML = text + text;
  }

});
