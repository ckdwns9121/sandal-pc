import React from 'react';
import styles from './Agree.module.scss';

export default ({ content }) => {

    return (
        <div className={styles['table']}>
            <div className={styles['wrap']} dangerouslySetInnerHTML={{ __html: content }} />

            {/* <div className={styles['column']}>
                <div className={styles['count_row']}>
                    1. 개인정보처리방침의 의의
                </div>
                <div className={styles['content']}>
                    <div className={styles['area']}>
                        주식회사 샌달(이하”회사”)는 이용자의 ‘동의를 기반으로 개인정보를 수집·이용 및 제공’하고 있으며, ‘이용자의
                        권리 (개인정보 자기결정권)를 적극적으로 보장’합니다.<br />
                    </div>
                    <div className={styles['area']}>
                        회사는 정보통신서비스제공자가 준수하여야 하는 대한민국의 관계 법령 및 개인정보보호 규정, 가이드라인을
                        준수하고 있습니다.<br />
                    </div>
                    <div className={styles['area']}>
                        “개인정보처리방침”이란 이용자의 소중한 개인정보를 보호함으로써 이용자가 안심하고 서비스를 이용할 수
                        있도록 회사가 준수해야 할 지침을 의미합니다.<br />
                        본 개인정보처리방침은 회사가 제공하는 카카오계정 기반의 서비스(이하 ‘서비스’라 함)에 적용됩니다.<br />
                    </div>
                </div>
            </div>
            <div className={styles['column']}>
                <div className={styles['count_row']}>
                    2. 개인정보 수집
                </div>
                <div className={styles['content']}>
                    <div className={styles['area']}>
                        서비스 제공을 위한 필요 최소한의 개인정보를 수집하고 있습니다.<br />
                        회원 가입 시 또는 서비스 이용 과정에서 홈페이지 또는 개별 어플리케이션이나 프로그램 등을 통해 아래와 같은
                        서비스 제공을 위해 필요한 최소한의 개인정보를 수집하고 있습니다.<br />
                    </div>
                    <div className={styles['area']}>
                        [샌달계정]<br />
                        필수  : 이메일, 비밀번호, 이름(닉네임), 프로필사진, 친구목록, 카카오톡 전화번호(카카오톡 이용자의 경우에
                        한함), 연락처, 서비스 이용내역, 서비스 내 구매 및 결제 내역<br />
                        선택 : 생년월일, 성별, 배송지정보(수령인명, 배송지 주소, 전화번호)<br />
                        [본인인증 시]<br />
                        이름, 성별, 생년월일, 휴대폰번호, 통신사업자, 내/외국인 여부, 암호화된 이용자 확인값(CI), 중복가입확인정보(DI)<br />
                        [법정대리인 동의 시]<br />
                        법정대리인 정보(이름, 성별, 생년월일, 휴대폰번호, 통신사업자, 내/외국인 여부, 암호화된 이용자 확인값(CI), 중복
                        가입확인정보(DI))<br />
                        [유료서비스 이용 시]<br />
                        신용카드 결제 시 : 카드번호(일부), 카드사명 등<br /><br />
                        휴대전화번호 결제 시 : 휴대전화번호, 결제승인번호 등<br /><br />
                        계좌이체 시 : 예금주명, 계좌번호, 계좌은행 등<br />
                        상품권 이용 시 : 상품권 번호, 해당 사이트 아이디<br /><br /><br /><br />
                        [환불처리 시]<br />
                        계좌은행, 계좌번호, 예금주명, 이메일<br />
                        [현금영수증 발행 시]<br />
                        휴대폰번호, 현금영수증 카드번호<br /><br />

                        필수정보란? : 해당 서비스의 본질적 기능을 수행하기 위한 정보<br />
                        선택정보란? : 보다 특화된 서비스를 제공하기 위해 추가 수집하는 정보 (선택 정보를 입력하지 않은 경우에도
                        서비스 이용 제한은 없습니다.)
                    </div>
                    <div className={styles['area']}>
                        “개인정보처리방침”이란 이용자의 소중한 개인정보를 보호함으로써 이용자가 안심하고 서비스를 이용할 수 
                        있도록 회사가 준수해야 할 지침을 의미합니다.
                        본 개인정보처리방침은 회사가 제공하는 카카오계정 기반의 서비스(이하 ‘서비스’라 함)에 적용됩니다.
                    </div>
                </div>
            </div>
            <div className={styles['column']}>
                <div className={styles['count_row']}>
                    3. 개인정보처리방침의 의의
                </div>
                <div className={styles['content']}>
                    <div className={styles['area']}>
                        주식회사 샌달(이하”회사”)는 이용자의 ‘동의를 기반으로 개인정보를 수집·이용 및 제공’하고 있으며, ‘이용자의 
                        권리 (개인정보 자기결정권)를 적극적으로 보장’합니다.
                    </div>
                    <div className={styles['area']}>
                        회사는 정보통신서비스제공자가 준수하여야 하는 대한민국의 관계 법령 및 개인정보보호 규정, 가이드라인을 
                        준수하고 있습니다.
                    </div>
                    <div className={styles['area']}>
                        “개인정보처리방침”이란 이용자의 소중한 개인정보를 보호함으로써 이용자가 안심하고 서비스를 이용할 수 
                        있도록 회사가 준수해야 할 지침을 의미합니다.
                        본 개인정보처리방침은 회사가 제공하는 카카오계정 기반의 서비스(이하 ‘서비스’라 함)에 적용됩니다.
                    </div>
                </div>
            </div> */}
        </div>
    );
};