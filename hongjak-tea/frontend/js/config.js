// Firebase Console > 프로젝트 설정 > 내 앱 > SDK 설정 및 구성에서 복사.
// 웹 앱의 공개 구성값만 넣습니다. 서비스 계정 키나 관리자 비밀번호는 금지.
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
// 원본 로고 파일을 frontend/assets/ 에 넣고 아래 상대 경로를 지정하세요.
export const logoPath = ""; // 예: "./assets/hongjak-logo.svg"
export const categories = ["가향차", "싱글오리진", "블렌드티", "동양차", "허브티"];
export const stockLabels = {available:"비치 중", low:"소량 남음", out:"소진"};
