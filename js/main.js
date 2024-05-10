/*
전역변수 vs 지역변수*/
let active_index = 0;
let len = $('.panel>li').length;
let enable_event = true;
let timer;

$('.next').on('click', function (event) {
	event.preventDefault();
	/*    현재 on이라는 활성화 클래스가 붙어있는 순번을 찾습니다
    => 활성화 클래스가 붙은 순번을 변수에 current_index라고 담겠습니다
    오리지널 순서는 0 1 2 3 4 -> 0
    여기에서 current_index를 이동할 인덱스의 값과 비교해서
    방향을 설정해서 이동시키게 하는 방법으로 코딩이 되어야합니다    */
	if (enable_event) {
		enable_event = false;
		let current_index = $('.panel>li').filter('.on').index();
		console.log(current_index);
		let next_index;
		if (current_index != len - 1) {
			next_index = current_index + 1;
		} else {
			next_index = 0;
		}
		//0123401234
		active_index = next_index;
		/*위의 코드는 순환하는 슬라이드의 순번을 구해주는 코드입니다
최종 순번을 구한값(next_index)을 전역변수인 active_index에 넣어서
전체적인 슬라이드의 순번을 관리하게 합니다 - > 싱크를 맞추기 위해서 */
		show_next(active_index);
	}
});
/* 이동하는 방향에 따른 코드 */
// 다음으로 이동하는 코드
function show_next(index) {
	/* li중에 활성화클래스가 있는 li를 움직이게 합니다 =>animate()로 움직이는것
    어떻게움직이고, 얼마동안 움직이고, 움직인후 행동은 animate() 소괄호 안에서 코딩함 */
	/* animate(무엇을 움직을것인가,얼마동안?, 움직인후?) */
	$('.panel>li')
		.filter('.on')
		.stop()
		.animate({ left: '-100%' }, 500, function () {
			$(this).removeClass('on').hide();
		});
	//위 코드는 현재활성화된 슬라이드li를 옆으로(넥스트방향으로) 이동하는 코드

	//이다음코드는 이후 슬라이드가 나타나게하는 코드
	$('.panel>li')
		.eq(index)
		.show()
		.css({ left: '100%' })
		.animate({ left: '0%' }, 500, function () {
			$(this).addClass('on');
			enable_event = true;
		});
	$('.navi>li>a').removeClass('on');
	$('.navi>li').eq(index).children('a').addClass('on');
}
$('.prev').on('click', function (event) {
	event.preventDefault();
	//0432104321
	if (enable_event) {
		enable_event = false;
		let current_index = $('.panel>li').filter('.on').index();
		let prev_index;
		if (current_index != 0) {
			prev_index = current_index - 1;
		} else {
			prev_index = len - 1;
		}
		active_index = prev_index;
		show_prev(active_index);
	}
});
//이전으로 이동하는 코드
function show_prev(index) {
	$('.panel>li')
		.filter('.on')
		.stop()
		.animate({ left: '100%' }, 500, function () {
			$(this).removeClass('on').hide();
		});
	$('.panel>li')
		.eq(index)
		.show()
		.css({ left: '-100%' })
		.animate({ left: '0%' }, 500, function () {
			$(this).addClass('on');
			enable_event = true;
		});
	$('.navi>li>a').removeClass('on');
	$('.navi>li').eq(index).children('a').addClass('on');
}

//네비 버튼을 눌렀을때 발생 조건에 따라서
//함수를 호출합니다

$('.navi>li').on('click', function (event) {
	event.preventDefault();
	//예 현재는 5번이 보이고 저는 2번을 누르는상태
	//현재 활성화클래스가 있는 인덱스를 구합니다 => 5

	if (enable_event) {
		enable_event = false;
		let current_index = $('.panel>li').filter('.on').index();
		//타겟인덱스를 구합니다(네비버튼을 누른 가고자하는 타겟) => 2
		let target_index = $(this).index();

		//중요 전역변수와 싱크를 맞춰야합니다 //
		active_index = target_index;
		//만약 활성화인덱스와 타겟인덱스가 같으면? 아무일이 일어나지 않음
		if (active_index == current_index) {
			enable_event = true;
			return;
		}
		//만약 활성화 인덱스가 타겟인덱스보다 크다면?
		if (active_index > current_index) {
			show_next(active_index);
		}
		//만약 활성화 인덱스가 타겟인덱스보다 작다면?
		if (active_index < current_index) {
			show_prev(active_index);
		}
	}
});

// 자동으로 롤링되는 슬라이드
$('#start').on('click', function () {
	// html태그 속성을 변경하는 방법 attr() <- 제이쿼리
	// 바닐라 자바스크립트에서 겟어트리뷰트, 셋어트리뷰트
	$('#start').attr('disabled', true);
	$('#stop').attr('disabled', false);
	/*정해진것을 반복적으로 셋팅하겠다라는뜻
	3초마다 함수를 반복적으로 실행하도록  web API에 요청하는것*/

	timer = setInterval(function () {
		// 3항 연산자
		active_index != len - 1 ? active_index++ : (active_index = 0);
		show_next(active_index);
	}, 3000);
});
// 스탑을 클릭했을때
$('#stop').on('click', function () {
	$('#start').attr('disabled', false);
	$('#stop').attr('disabled', true);

	clearInterval(timer);
});
