document.addEventListener('DOMContentLoaded', function() {

    const headerBanner = new Swiper('#header .header-banner', {
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation : {
            nextEl : '.btn-next',
            prevEl : '.btn-prev',
        },
        pagination: {
            el: ".pagination",
            // clickable: true,
            type: "fraction",
        },
        watchSlidesProgress: true, //현재 보이는 슬라이드
        on: {
            init: function() {
                resetTabindex();
            },
            activeIndexChange: function () {
                resetTabindex();
            },
        }
    });

    // 웹접근성 스와이퍼 포커스
    function resetTabindex() {
        const slides = document.querySelectorAll(".header-banner .swiper-slide");
        const activeSlide = document.querySelectorAll(".header-banner .swiper-slide-active");
        const visibleSlide = document.querySelectorAll(".header-banner .swiper-slide-visible");

        // 슬라이드가 존재하지 않으면 실행 중단
        if (!slides || slides.length === 0) {
            return;
        }

        // 모든 슬라이드의 링크에서 tabindex를 -1로 설정
        slides.forEach(slide => {
            const link = slide.querySelector('a');
            if (link) link.setAttribute('tabindex', '-1');
        });

        // 활성 슬라이드의 링크 tabindex를 0으로 설정
        if (activeSlide) {
            activeSlide.forEach(slide => {
                const activeLink = slide.querySelector('a');
                if (activeLink) activeLink.setAttribute('tabindex', '0');
            });
        }

        if (visibleSlide) {
            visibleSlide.forEach(slide => {
                const visibleLink = slide.querySelector('a');
                if (visibleLink) visibleLink.setAttribute('tabindex', '0');
            });
        }
    }

    const autoplaySlide = document.querySelector('.header-banner .btn-stop');
    if (autoplaySlide) {
        autoplaySlide.addEventListener('click', function() {
            slideAutoplay(headerBanner, autoplaySlide);
        });
    }
    // 슬라이드 재생/정지 함수
    function slideAutoplay(slide, autoplayBtn) {
        let isActive = autoplayBtn.classList.contains('active');

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


    
    const gnb = document.querySelector('.header-bottom .gnb');
    const gnbDepth1Items = document.querySelectorAll('.header-bottom .gnb .depth1-item > a');
    const allDepth2 = document.querySelectorAll('.header-bottom .gnb .depth2');
    const headerDim = document.querySelector("#header .dim");

    const mobileGnbWrap = document.querySelector('.mobile-gnb-wrap');
    const mobileMenu = document.querySelector('.util .all-menu');
    const mobileClose = document.querySelector('.mobile-gnb-wrap .mobile-close');

    const screenWidth = window.innerWidth;

    // GNB 초기화
    function resetGnb() {
        gnbDepth1Items.forEach(link => {
            link.parentElement.classList.remove('active');
        });
        allDepth2.forEach(depth2 => {
            depth2.classList.remove('active'); // active 클래스 추가
        });
        headerDim.classList.remove('active');
    }
    
    // GNB - PC
    function pcGnb(){

        // depth1 이벤트 설정
        gnbDepth1Items.forEach(link => {
            const parent = link.parentElement;
            // const depth2Menu = parent.querySelector('.depth2');

            // 클릭 이벤트
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (parent.classList.contains('active')) {
                    resetGnb();
                } else {
                    resetGnb();
                    parent.classList.add('active');
                
                    const allDepth2 = document.querySelectorAll('.gnb .depth2');
                    allDepth2.forEach(depth2 => {
                        depth2.classList.add('active'); // active 클래스 추가
                    });

                    headerDim.classList.add('active');
                }
            });

            // 마우스 오버 이벤트
            link.addEventListener('mouseenter', () => {
                resetGnb();
                parent.classList.add('active');
                // if (depth2Menu) depth2Menu.classList.add('active');
                // if (depth2Menu) document.querySelector('.gnb .depth2').classList.add('active');

                const allDepth2 = document.querySelectorAll('.gnb .depth2');
                allDepth2.forEach(depth2 => {
                    depth2.classList.add('active'); // active 클래스 추가
                });

                headerDim.classList.add('active');
            });

            // 마우스 아웃 이벤트
            gnb.addEventListener('mouseleave', resetGnb);

            // 키보드 포커스 진입
            link.addEventListener('focus', () => {
                resetGnb();
                parent.classList.add('active');

                // if (depth2Menu) depth2Menu.classList.add('active');
                const allDepth2 = document.querySelectorAll('.gnb .depth2');
                allDepth2.forEach(depth2 => {
                    depth2.classList.add('active'); // active 클래스 추가
                });
                headerDim.classList.add('active');
            });

            document.addEventListener('focusin', function(e) {
                if (!gnb.contains(e.target)) {
                    resetGnb();
                }
            });
        });

        // gnb 영역 밖 클릭 시 메뉴 닫기
        document.addEventListener('click', (e) => {
            if (!gnb.contains(e.target) && !headerDim.contains(e.target)) {
                resetGnb();
            }
        });
    }
    pcGnb();

    // GNB - MOBILE
    function mobileGnb(){
        openMobileWrap();
        closeMobileWrap();

        const mobilegnbDepth1Items = document.querySelectorAll('.mobile-gnb .depth1-item > a');
        const mobilegnbDepth2 = document.querySelectorAll('.mobile-gnb .depth2');

        mobilegnbDepth1Items.forEach(item => {
            item.addEventListener('click', function(){
                if(!item.classList.contains('active')){
                    // 모든 항목에서 active 제거
                    mobilegnbDepth1Items.forEach(btn => btn.classList.remove('active'));

                    // 현재 클릭한 항목에만 active 추가
                    item.classList.add('active');
                } else{
                    item.classList.remove('active');
                }
            });
        });
    }
    mobileGnb();

    function openMobileWrap(){
        mobileMenu.addEventListener('click', function(){

            if( !mobileGnbWrap.classList.contains('open')) {
                mobileGnbWrap.classList.add('open');
                document.querySelector('body').classList.add('noScroll');
                setMobileGnbFocusTrap();
            }
        });
    }
    openMobileWrap();

    function closeMobileWrap(){
        mobileClose.addEventListener('click', function(){
            mobileGnbWrap.classList.remove('open');
            document.querySelector('body').classList.remove('noScroll');

            removeMobileGnbFocusTrap();
        });
    }
    closeMobileWrap();

    // 윈도우 리사이즈 시 모바일/PC 초기화
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        if (width > 1025) {
            pcGnb();
            mobileGnbWrap.classList.remove('open');

        } else if  (width < 1024) {
            mobileGnb();

            openMobileWrap();
            closeMobileWrap();
        }
        
        if (width >= 769) {
            resetGnb();
        }
    });

    // 모바일 전체메뉴 웹접근성 개선: 포커스 트랩 및 첫 포커스 이동
    function setMobileGnbFocusTrap() {
        const focusableSelectors = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

        setTimeout(() => {
            const focusableElements = Array.from(mobileGnbWrap.querySelectorAll(focusableSelectors))
                .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

            if (focusableElements.length === 0) return;

            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            function trapFocus(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            }

            // 기존 이벤트 제거 후 재등록(중복 방지)
            if (mobileGnbWrap._trapFocusHandler) {
                mobileGnbWrap.removeEventListener('keydown', mobileGnbWrap._trapFocusHandler);
            }
            mobileGnbWrap.addEventListener('keydown', trapFocus);
            mobileGnbWrap._trapFocusHandler = trapFocus;

            // 첫번째 포커스 요소로 이동 (닫기버튼이 아닌 메뉴 첫 요소)
            firstFocusable.focus();
        }, 2000); // 닫기버튼 DOM 추가 후 확실히 실행
    }

    // 포커스 트랩 해제
    function removeMobileGnbFocusTrap() {
        if (mobileGnbWrap._trapFocusHandler) {
            mobileGnbWrap.removeEventListener('keydown', mobileGnbWrap._trapFocusHandler);
            mobileGnbWrap._trapFocusHandler = null;
        }
    }



    // 검색창 히스토리 영역 활성화 제어
    (function() {
        const srchWrap = document.querySelector('.srch-wrap');
        const inpWrap = srchWrap ? srchWrap.querySelector('.inp-wrap') : null;
        const searchInput = inpWrap ? inpWrap.querySelector('.inp') : null;
        const historyArea = srchWrap ? srchWrap.querySelector('.history-area') : null;

        if (!inpWrap || !searchInput || !historyArea) return;

        // input에 포커스하거나 inpWrap에 마우스 오버하면 history-area 활성화
        function openHistory() {
            historyArea.classList.add('active');
        }

        // 외부 클릭 시 닫기
        function onDocClick(e) {
            if (!inpWrap.contains(e.target) && !historyArea.contains(e.target)) {
                historyArea.classList.remove('active');
            }
        }
        
        // inpWrap.addEventListener('mouseenter', openHistory);
        searchInput.addEventListener('focus', openHistory);
        searchInput.addEventListener('click', openHistory);

        // 문서 클릭으로 외부 클릭 처리
        document.addEventListener('click', onDocClick);

        // 히스토리 영역 내부에서 클릭해도 닫히지 않게 stopPropagation (선택적)
        historyArea.addEventListener('click', function(e){
            e.stopPropagation();
        });

        // 키보드로 탭 이동 시, history-area 내부의 포커스 가능한 요소들을 체크해서
        // 마지막 요소에서 Tab(Shift 없는) 누르면 history-area 닫기
        function getFocusableElements(container) {
            return Array.from(container.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'))
                .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
        }

        historyArea.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            const focusables = getFocusableElements(historyArea);
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            // Tab forward on last element -> close history
            if (!e.shiftKey && document.activeElement === last) {
                // allow the browser to move focus (which will go outside), then close
                setTimeout(() => {
                    historyArea.classList.remove('active');
                }, 0);
            }

            // Shift+Tab on first element -> close (focus moves outside backwards)
            if (e.shiftKey && document.activeElement === first) {
                setTimeout(() => {
                    historyArea.classList.remove('active');
                }, 0);
            }
        });

        // 보조: focusout으로 포커스가 historyArea 밖으로 완전히 옮겨가면 닫기
        historyArea.addEventListener('focusout', function() {
            // nextTick에서 document.activeElement를 검사
            setTimeout(() => {
                const active = document.activeElement;
                if (!historyArea.contains(active) && !inpWrap.contains(active)) {
                    historyArea.classList.remove('active');
                }
            }, 0);
        });
    })();


    // 패밀리 사이트
    const btnFamilySite = document.querySelectorAll('.family-site-button');
    const familySiteList = document.querySelectorAll('.family-site-list');
    const familySiteWrap = document.querySelectorAll('.family-site-wrap');

    btnFamilySite.forEach((openBtn, i) => {
        openBtn.addEventListener('click', function () {
            const isActive = familySiteList[i].classList.contains('active');

            familySiteList.forEach(list =>
                list.classList.remove('active')
            );
            if (!isActive) {
                familySiteList[i].classList.add('active');
                openBtn.classList.add('active');
                openBtn.title = '닫기';
            } else {
                openBtn.classList.remove('active');
                openBtn.title = '열기';
            }
        });
    });

    // 251219 다른 영역 클릭 시 패밀리사이트 닫기 (ej)
    document.addEventListener('click', function(e) {
        familySiteWrap.forEach((wrap, i) => {
            if (!wrap.contains(e.target)) {
                familySiteList[i].classList.remove('active');
                btnFamilySite[i].classList.remove('active');
                btnFamilySite[i].title = '열기';
            }
        });
    });



    /* 251014 웹 접근성 품질개선 - input/textarea.inp 지우기 버튼 동적 생성 (ej) */  
    // input.inp, textarea.inp 옆에 지우기 버튼 동적 추가
    document.querySelectorAll('input.inp, textarea.inp').forEach(function(inp) {
        // 이미 버튼이 있으면 중복 추가 방지
        if (!inp.parentNode.querySelector('.form-control-clear')) {
            var clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'form-control-clear hidden';
            clearBtn.textContent = '지우기';
            // input 바로 뒤에 삽입
            inp.parentNode.insertBefore(clearBtn, inp.nextSibling);

            // 버튼 클릭 시 입력값 삭제 및 포커스
            clearBtn.addEventListener('click', function() {
                inp.value = '';
                clearBtn.classList.add('hidden');
                inp.focus();
                // 필요시 input 이벤트도 발생
                var event = new Event('input', { bubbles: true });
                inp.dispatchEvent(event);
            });
        }
    });

    // 입력값 있을 때만 버튼 노출
    function toggleClearButton(e) {
        var inp = e.target;
        var clearBtn = inp.parentNode.querySelector('.form-control-clear');
        if (!clearBtn) return;
        if (inp.value) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }

    document.querySelectorAll('input.inp, textarea.inp').forEach(function(inp) {
        inp.addEventListener('input', toggleClearButton);
        // 초기 상태 반영
        toggleClearButton({ target: inp });
    });
    /* // 251014 웹 접근성 품질개선 - input/textarea.inp 지우기 버튼 동적 생성 (ej) */ 

});