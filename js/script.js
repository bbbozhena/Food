window.addEventListener('DOMContentLoaded', () => {

// Tabs

    // Variables

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');


    // Function

    function hideTabContent () {
        tabsContent.forEach (item => {
            item.style.display = 'none';
        });

        tabs.forEach(item =>  {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent (i = 0) { 
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    // Listener
    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains ('tabheader__item')) {
            tabs.forEach((item , i ) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })







// Timer

    // Variables

    const deadline = '2022-06-11';


    // Function

    function getTimeRemaining (endtime) {
        const t = Date.parse (endtime) - Date.parse (new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor (t / (1000 * 60 * 60) % 24),
              minutes = Math.floor ((t / 1000 / 60) % 60),
              seconds = Math.floor ((t / 1000) % 60);
        return {
            'total': t,
            'days':days,
            'hours':hours,
            'minutes':minutes,
            'seconds':seconds
        };
    }

    function getZero (num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock (selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector ('#days'),
              hours = timer.querySelector ('#hours'),
              minutes = timer.querySelector ('#minutes'),
              seconds = timer.querySelector ('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

              updateClock();

        function updateClock () {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero (t.days);
            hours.innerHTML = getZero (t.hours);
            minutes.innerHTML = getZero (t.minutes);
            seconds.innerHTML = getZero (t.seconds);

            if (t.total <= 0) {
                clearInterval (timeInterval);
            }

        }    

    }

    setClock('.timer', deadline);


    // Modal

        // variables

        const modal = document.querySelector ('.modal');
        const modalBtn = document.querySelectorAll('[data-modal]');
        const modalTimerId = setTimeout (openModal,8000);

       

        // Listener
        modalBtn.forEach (btn => {
            btn.addEventListener ('click', openModal);
       });


       modal.addEventListener ('click', (e) => {
           if (e.target === modal || e.target.getAttribute('data-close') == '') {
               closeModal ();
           }
       })


        document.addEventListener ('keydown', (e) => {
            if (e.code === "Escape") {
                closeModal();
            }
        });
    

        // Function

        function openModal () {
            modal.style.display = 'block'
            document.body.style.overflow = 'hidden';
            clearInterval(modalTimerId);
        }

        function closeModal () {
            modal.style.display = 'none';
                document.body.style.overflow = '';
        }

        function showModalByScroll () {
            if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
                openModal();
                window.removeEventListener('scroll', showModalByScroll);
            }
        }

        window.onclick =  (e) => {
            if (e.target == modal ){
                closeModal();
            }
        };


        window.addEventListener('scroll', showModalByScroll);

        // Classes for cards

        class MenuCard {
            constructor (src, alt, title, descr, price, parentSelector, ...clases) {
                this.src = src;
                this.alt = alt;
                this.title = title;
                this.descr = descr;
                this.price = price;
                this.clases = clases;
                this.parent = document.querySelector(parentSelector);
                this.transfer = 27;
                this.changeToUAH ();
            }

            changeToUAH () {
                this.price = this.price * this.transfer;
            }

            render () {
                const element = document.createElement ('div');

                if (this.clases.length === 0) {
                    this.element = 'menu__item';
                    element.classList.add (this.element);
                } else {
                    this.clases.forEach(className => element.classList.add(className));
                }

                
                element.innerHTML = `
                        <img src= ${this.src} alt= ${this.alt} >
                        <h3 class="menu__item-subtitle">${this.title}"</h3>
                        <div class="menu__item-descr">${this.descr}</div>
                        <div class="menu__item-divider"></div>
                        <div class="menu__item-price">
                            <div class="menu__item-cost">Цена:</div>
                            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                `;
                this.parent.append (element);
            }
        }

        const getResource = async (url) => {
            const res = await fetch (url);

            if (!res.ok) {
                throw new Error(`Could not fetch ${url}, status: ${res.status}`);
            }

            return await res.json();
        };

        getResource('http://localhost:3000/menu') 
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

        


            // Forms



            const forms = document.querySelectorAll ('form');

            const message = {
                loading: 'img/form/spinner.svg',
                success: 'Success!',
                failure: 'Error'
            };

            forms.forEach (item => {
                bindpostDate(item);
            });
            
            const postDate = async (url, data) => {
                const res = await fetch (url, {
                    method: "POST",
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: data
                });

                return await res.json();
            };

            function bindpostDate (form) {
                form.addEventListener ('submit', (e) => {
                    e.preventDefault ();

                    const statusMessage = document.createElement ('div');
                    statusMessage.src = message.loading;
                    statusMessage.style.cssText = `
                    display: block;
                    margin: 0 auto;
                    `;
                    form.append (statusMessage);
                    form.insertAdjacentElement ('afterend', statusMessage);

                    

                    
                    const formData = new FormData (form);

                    const json = JSON.stringify(Object.fromEntries(formData.entries()));
                    

                    postDate('http://localhost:3000/requests', json)
                    .then(data => {
                            console.log (data);
                            showThanksModal(message.success);
                            statusMessage.remove ();
                    }).catch (() => {
                        showThanksModal (message.failure);
                    }).finally(() => {
                        form.reset();
                    })
                });
            }

            function showThanksModal (message){
                const prevModalDialog = document.querySelector ('.modal__dialog');

                prevModalDialog.classList.add ('hide');
                openModal();

                const thanksModal = document.createElement ('div');
                thanksModal.classList.add ('modal__dialog');
                thanksModal.innerHTML = `
                <div class = "modal__content">
                    <div class = "modal__close" data-close>×</div>
                    <div class = "modal__title">${message}</div>
                </div>
                `;

                document.querySelector ('.modal').append(thanksModal);
                setTimeout(() => {
                    thanksModal.remove();
                    prevModalDialog.classList.add ('show');
                    prevModalDialog.classList.add ('hide');
                    closeModal();
                }, 4000);
            }

            
            fetch(' http://localhost:3000/menu')
            .then(data => data.json())
            .then(res => console.log(res));




            // Slider

            const slides = document.querySelectorAll('.offer__slide');
            const prev = document.querySelector('.offer__slider-prev');
            const next = document.querySelector ('.offer__slider-next');
            const total = document.querySelector ('#total');
            const current = document.querySelector ('#current');
            const slidesWrapper = document.querySelector ('.offer__slider-wrapper');
            const slidesField = document.querySelector('.offer__slider-inner');
            const width = window.getComputedStyle (slidesWrapper).width;

            let slideIndex = 1;
            let offset = 0;

            if (slides.length < 10 ) {
                total.textContent = `0${slides.length}`;
                current.textContent = `0${slideIndex}`;
              } else {
                 total.textContent = slides.length;
                 current.textContent = slideIndex;
              }



            slidesField.style.width = 100 * slides.length + "%";
            slidesField.style.display = 'flex';
            slidesField.style.transition = '0.5s all';

            slidesWrapper.style.overflow = 'hidden'

            slides.forEach(slide => {
                slide.style.width = width;
            });

            next.addEventListener('click', () => {
                if (offset === +width.slice(0, width.length - 2) * (slides.length - 1)) {
                    offset = 0;
                }else {
                    offset += +width.slice(0, width.length - 2);
                }
                slidesField.style.transform = `translateX(-${offset}px)`;

                if (slideIndex == slides.length) {
                    slideIndex = 1;
                } else  {
                    slideIndex ++;
                }

                if (slides.length < 10) {
                    current.textContent = `0${slideIndex}`;
                } else {
                    current.textContent = slideIndex;
                }
            });

            prev.addEventListener('click', () => {
                if (offset == 0) {
                    offset = +width.slice(0, width.length - 2) * (slides.length - 1)
                }else {
                    offset -= +width.slice(0, width.length - 2);
                }
                slidesField.style.transform = `translateX(-${offset}px)`;

                if (slideIndex == 1) {
                    slideIndex = slides.length;
                } else  {
                    slideIndex --;
                }

                if (slides.length < 10) {
                    current.textContent = `0${slideIndex}`;
                } else {
                    current.textContent = slideIndex;
                }
                
            });



//             showSlides(slideIndex);

//            

//             function showSlides(n) {
//                 if (n > slides.length) {
//                     slideIndex = 1;
//                 }

//                 if (n < 1) {
//                     slideIndex = slides.length;
//                 }



//                 slides.forEach(item => item.style.display = 'none');
                
//                 slides[slideIndex - 1].style.display = 'block';

//                 if (slides.length < 10 ) {
//                     current.textContent = `0${slideIndex}`;
//                 } else {
//                     current.textContent = slideIndex;
//                 }

//             }



//             function plusSlides (n) {
//                 showSlides(slideIndex += n);
//             }

//             prev.addEventListener('click', () => {
//                 plusSlides(-1);
//             });

//             next.addEventListener ('click', () => {
//                 plusSlides(1);
//             });

});



