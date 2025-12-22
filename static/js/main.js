document.addEventListener('DOMContentLoaded', function() {

    /* 251219 카운트업 효과 - 다시 보일 때마다 재생 (ej) */
    const counters = document.querySelectorAll(".counter");

    function startCount(el) {
        const target = Number(el.dataset.target);
        const duration = 1000;
        const start = Number(el.dataset.start) || 0;
        const startTime = performance.now();

        // 기존 애니메이션이 있으면 취소
        if (el._countAnimId) {
            cancelAnimationFrame(el._countAnimId);
            el._countAnimId = null;
        }

        function animate(time) {
            const progress = Math.min((time - startTime) / duration, 1);
            const value = Math.floor(start + (target - start) * progress);
            el.textContent = value.toLocaleString();

            if (progress < 1) {
                el._countAnimId = requestAnimationFrame(animate);
            } else {
                el.textContent = target.toLocaleString();
                el._countAnimId = null;
            }
        }

        el._countAnimId = requestAnimationFrame(animate);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const el = entry.target;

            if (entry.isIntersecting) {
                // 이미 애니메이션 중이면 중복 시작 방지
                if (el._countAnimId) return;

                // 보일 때마다 시작값으로 리셋 (dataset.start가 없으면 0)
                el.textContent = (Number(el.dataset.start) || 0).toLocaleString();
                startCount(el);
            } else {
                // 화면에서 벗어나면 애니메이션 취소하고 초기값으로 리셋
                if (el._countAnimId) {
                    cancelAnimationFrame(el._countAnimId);
                    el._countAnimId = null;
                }
                el.textContent = (Number(el.dataset.start) || 0).toLocaleString();
            }
        });
    }, { threshold: 0.6 });

    counters.forEach(el => {
        if (!el.dataset.start) el.dataset.start = '0';
        observer.observe(el);
    });
    /* // 251219 카운트업 효과 - 다시 보일 때마다 재생 (ej) */

    

    const btnWraps = document.querySelectorAll('.tab-container > .btn-wrap');

    btnWraps.forEach((wrap) => {
        const tabBtns = wrap.querySelectorAll('button');

        if (tabBtns.length > 0) {
            tabBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    tabBtns.forEach(item => {
                        item.classList.remove('active');
                        item.removeAttribute('title');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('title', '선택됨');

                    //슬라이드 초기화
                    swipers.forEach(swiper => {
                        swiper.slideToLoop(0,0,true);
                        // slideToLoop 직후 접근성 업데이트
                        updateSlideFocus(swiper);
                        updateSwiperAccessibility();
                    });
                });
            });
        }
    });


    const responsiveSwiperContainers = document.querySelectorAll('.swiper-container.responsive');
    const swipers = new Map(); // container → swiper 인스턴스 저장용

    function initResponsiveSwiper(container) {
        const instance = new Swiper(container, {
            spaceBetween: 24,
            navigation: {
                nextEl: container.querySelector('.btn-next'),
                prevEl: container.querySelector('.btn-prev'),
            },
            slidesPerView: 1,
            observer: true,
            observeParents: true,
            pagination: {
                el: container.querySelector(".pagination"),
                clickable: true,
                renderBullet: function(index, className) {
                    return `<button class="${className}"><span class="blind">${index + 1}번 슬라이드</span></button>`;
                },
            },
            on: {
                init() {
                    updateSlideFocus(this);
                },
                transitionEnd() {
                    updateSlideFocus(this);
                },
                touchEnd() {
                    if (this.isEnd) {
                        this.slideToLoop(-1);
                        updateSlideFocus(this);
                        updateSwiperAccessibility();
                    }
                },
                slideChangeTransitionEnd() {
                    updateSlideFocus(this);
                },
            },
            // breakpoints: {
            //     450: { slidesPerView: 2, spaceBetween: 24 },
            // },
        });

        swipers.set(container, instance);
    }

    function destroyResponsiveSwiper(container) {
        const instance = swipers.get(container);
        if (instance) {
            instance.destroy(true, true); // 완전히 제거
            swipers.delete(container);

            console.log('Destroyed Swiper for container:', container);
            
        }
    }

    /* ------------------ 핵심 로직 ------------------ */
    function updateResponsiveSwipers() {
        responsiveSwiperContainers.forEach(container => {
            if (window.innerWidth < 769) {
                // 768px 이하 → Swiper 생성
                if (!swipers.has(container)) initResponsiveSwiper(container);
            } else {
                // 769px 이상 → Swiper 완전 해제
                destroyResponsiveSwiper(container);
            }
        });
    }

    /* 최초 실행 */
    updateResponsiveSwipers();

    /* 리사이즈 대응 */
    window.addEventListener('resize', () => {
        updateResponsiveSwipers();
    });

    const tabWraps = document.querySelectorAll('.detail-wrap');

    tabWraps.forEach((wrap) => {
        const tabBtns = wrap.querySelectorAll('.btn');
        const tabConts = document.querySelectorAll('.contents');

        if (tabBtns.length > 0) {
            tabBtns.forEach((btn, index) => {
                btn.addEventListener('click', function() {
                    tabBtns.forEach(item => {
                        item.classList.remove('active');
                        item.removeAttribute('title');
                    });
                    btn.classList.add('active');
                    btn.setAttribute('title', '선택됨');

                    if (tabConts.length > 0) {
                        tabConts.forEach(cont => cont.classList.remove('active'));
                        if (tabConts[index]) {
                            tabConts[index].classList.add('active');
                        }
                    }
                });
            });
        }
    });

    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector(".dropdown-btn");
        const box = dropdown.querySelector(".dropdown-box");
        const closeBtn = dropdown.querySelector(".popup-close");

        const focusableSelectors =
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

        let focusableElements, firstFocusable, lastFocusable;

        // 열기/닫기 토글
        btn.addEventListener("click", e => {
            e.stopPropagation();

            const isActive = dropdown.classList.toggle("active");
            box.hidden = !isActive;
            btn.setAttribute("aria-expanded", isActive);

            if (isActive) {
                openDropdown(dropdown);
            } else {
                closeDropdown(dropdown);
            }
        });

        // 닫기 버튼 클릭 시 닫기
        closeBtn.addEventListener("click", e => {
            e.stopPropagation();
            closeDropdown(dropdown);
        });

        function openDropdown(target) {
            // 다른 드롭다운 닫기
            dropdowns.forEach(d => {
                if (d !== target) closeDropdown(d);
            });

            // 포커스 가능한 요소 목록
            focusableElements = box.querySelectorAll(focusableSelectors);
            firstFocusable = focusableElements[0];
            lastFocusable = focusableElements[focusableElements.length - 1];

            if (firstFocusable) firstFocusable.focus();

            document.addEventListener("click", handleOutsideClick);
            document.addEventListener("keydown", handleKeydown);
        }

        function closeDropdown(target) {
            if (!target.classList.contains("active")) return;
            target.classList.remove("active");
            box.hidden = true;
            btn.setAttribute("aria-expanded", "false");
            btn.focus();

            document.removeEventListener("click", handleOutsideClick);
            document.removeEventListener("keydown", handleKeydown);
        }

        function handleOutsideClick(e) {
            if (!dropdown.contains(e.target)) {
                closeDropdown(dropdown);
            }
        }

        function handleKeydown(e) {
            if (!dropdown.classList.contains("active")) return;

            if (e.key === "Escape") {
                e.preventDefault();
                closeDropdown(dropdown);
            }

            if (e.key === "Tab") {
                if (focusableElements.length === 0) return;

                if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
                }
            }
        }
    });

    const selects = document.querySelectorAll(".select-box");
    selects.forEach(select => {
        select.addEventListener("click", e => {
            e.stopPropagation();

            let isOpen = select.classList.contains('open');

            if( isOpen ){
                select.classList.remove('open');
            } else{
                select.classList.add('open');
            }
        });

        select.addEventListener("focusout", () => {
            setTimeout(() => {
                // 현재 포커스된 요소
                const active = document.activeElement;

                // 만약 select 내부에 포커스가 하나라도 남아있다면 종료
                // contains() → select 내부인지 확인
                if (select.contains(active)) return;

                // 내부 포커스가 모두 사라진 경우 open 제거
                select.classList.remove("open");
            }, 0);
        });


        // 바깥 클릭 시 닫기
        document.body.addEventListener('click', function (e) {
            if (!select.contains(e.target)) {
                select.classList.remove('open');
            }
        });
    });


    const programSlider = new Swiper('.main .program-slider .swiper-container', {
        navigation : {
            nextEl : '.program-slider .btn-next',
            prevEl : '.program-slider .btn-prev',
        },
        pagination: {
            el: ".program-slider .pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<button type="button" class="' + className + '"><span>' + (index + 1) + '번 슬라이드' + '</span></button>';
            },
        },
        slidesPerView: 1,
        spaceBetween: 24,
        watchSlidesProgress: true, //현재 보이는 슬라이드
        on: {
            init: function() {
                updateSlideFocus(this);
            },
            slideChangeTransitionEnd: function () {
                updateSlideFocus(this);
            }
        },
        breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
        },

    });


    if (window.innerWidth > 769) {
        // 768px 이상 → Swiper 완전 해제
        destroyResponsiveSwiper(programSlider);

        // if (!swipers.has(container)) initResponsiveSwiper(container);
    } 
    // else {
    //     // 769px 이상 → Swiper 완전 해제
    //     destroyResponsiveSwiper(container);
    // }


    const btnSlider = document.querySelectorAll('.details.swiper-container');
    btnSlider.forEach(container => {
        const tabSwiper = new Swiper(container, {
            // 기본값 (모바일 전용 설정)
            slidesPerView: 'auto',
            spaceBetween: 8,
            navigation: {
                nextEl: '.details .next',
                prevEl: '.details .prev',
            },

            // 반응형 설정
            breakpoints: {
                769: {
                    // 769px 이상에서는 슬라이드 기능 비활성화 효과
                    slidesPerView: 'auto',
                    spaceBetween: 0,
                    allowTouchMove: false, // 드래그 불가
                    simulateTouch: false,
                    navigation: false,
                    pagination: false,
                },
            },
        });
    });


    const partnerSlider = new Swiper('.main .partner-slider .swiper-container', {
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        loop:true,
        slidesPerView: "auto",
        // loopedSlides: 5, //251219 삭제(ej
        observer: false,
        observeParents: false,

        navigation : {
            nextEl : '.partner-slider .btn-next',
            prevEl : '.partner-slider .btn-prev',
        },
        slidesPerView : 'auto',
        spaceBetween : 24,
        watchSlidesProgress: true, //현재 보이는 슬라이드
        on: {
            init: function() {
                updateSlideFocus(this);
            },
            slideChangeTransitionEnd: function () {
                updateSlideFocus(this);
                updateSwiperAccessibility();
            }
        },
    });
    
    const autoplaySlide = document.querySelector('.partner-slider .btn-stop');
    if (autoplaySlide) {
        autoplaySlide.addEventListener('click', function() {
            slideAutoplay(partnerSlider, autoplaySlide);
        });
    }

    // 재생/정지 함수
    function slideAutoplay(slide, autoplayBtn) { 
        let isActive = autoplayBtn.classList.contains('active'); // 재생중 
        // //active 없을때 정지 버튼 
        // //지금 없음 -> 정지상태 
        if (!isActive) { //정지상태 
            slide.autoplay.stop(); //재생하기 
            autoplayBtn.classList.add('active'); 
            autoplayBtn.querySelector('span').textContent = '재생';
        } 
        else { //재생상태 
            slide.autoplay.start(); //멈추기
            autoplayBtn.classList.remove('active'); 
            autoplayBtn.querySelector('span').textContent = '멈추기';
        } 
    }

    // tip 박스 팝업
    const tipBtn = document.querySelectorAll('.tip-wrap .tip-btn');
    const tipBox = document.querySelectorAll('.tip-wrap .tip-box');

    if (tipBtn.length) {
        tipBtn.forEach((btn, index) => {
            const box = tipBox[index];

            btn.addEventListener('click', function(e) {
                e.stopPropagation();

                tipBox.forEach(b => b.classList.remove('active'));
                tipBtn.forEach(b => b.setAttribute('title', '닫기'));

                box.classList.add('active');
                btn.setAttribute('title', '닫기');

                // 닫기 버튼 처리
                const closeBtn = box.querySelector('.tip-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function () {
                        box.classList.remove('active');
                        btn.setAttribute('title', '닫기');
                        btn.focus();
                    });
                }

                // 바깥 클릭 시 닫기
                document.body.addEventListener('click', function (e) {
                    if (!box.contains(e.target) && !btn.contains(e.target)) {
                        box.classList.remove('active');
                        btn.setAttribute('title', '닫기');
                    }
                }, { once: true });
            });
        });
    }


    // 슬라이드 포커스 및 tabindex 제어 통합 함수
    function updateSlideFocus(swiper) {
        if (!swiper || !swiper.slides) return;

        const slides = swiper.slides;
        const visibleSlides = swiper.$el[0].querySelectorAll('.swiper-slide-visible');

        // focus 가능한 요소 셀렉터
        const focusableSelector = `
            a, button, input, textarea, select, summary, details,
            [href], [tabindex]:not([tabindex="-1"]),
            [contenteditable="true"]
        `;

        // 1) 모든 슬라이드 tabindex -1 + aria-hidden 추가
        slides.forEach(slide => {
            const focusables = slide.querySelectorAll(focusableSelector);
            focusables.forEach(el => el.setAttribute('tabindex', '-1'));

            slide.setAttribute('aria-hidden', 'true');
        });

        // 2) 활성 슬라이드 tabindex = 0
        const activeSlide = swiper.slides[swiper.activeIndex];
        if (activeSlide) {
            const focusables = activeSlide.querySelectorAll(focusableSelector);
            focusables.forEach(el => el.setAttribute('tabindex', '0'));

            activeSlide.removeAttribute('aria-hidden');
        }

        // 3) 보이는 슬라이드(tab / auto width 구성) tabindex = 0
        visibleSlides.forEach(slide => {
            const focusables = slide.querySelectorAll(focusableSelector);
            focusables.forEach(el => el.setAttribute('tabindex', '0'));

            slide.removeAttribute('aria-hidden');
        });
    }


    function updateSwiperAccessibility() {
        const slides = document.querySelectorAll('.swiper-slide');

        // 포커스 가능한 요소 셀렉터
        const focusableSelector = `
            a, button, input, textarea, select, details,
            [tabindex]:not([tabindex="-1"]),
            [contenteditable="true"]
        `;

        slides.forEach(slide => {
            const isHidden = slide.getAttribute('aria-hidden') === 'true';
            const focusables = slide.querySelectorAll(focusableSelector);

            if (isHidden) {
                // 숨겨진 슬라이드 → 접근성 트리에서 제외 + 포커스 차단
                slide.setAttribute('inert', '');

                focusables.forEach(el => {
                    el.setAttribute('tabindex', '-1');
                });
            } else {
                // 활성 슬라이드 → 접근 가능
                slide.removeAttribute('inert');

                focusables.forEach(el => {
                    el.setAttribute('tabindex', '0');
                });
            }
        });
    }


})