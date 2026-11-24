# 홍작 찻장 | Hongjak Tea Collection

Where there is tea, there is hope.

홍작 동방의 차 목록과 부원 시음평을 관리하는 웹사이트입니다. 이전 프로젝트 대화의 확정 요구사항을 기반으로 재구성한 GitHub 업로드용 소스입니다. 기존 배포 사이트의 원본 소스, 로고 이미지 및 기존 데이터는 확보되지 않았으므로 포함되지 않았습니다.

## 1. 폴더 구조

```text
hongjak-tea/
├── frontend/                 # 웹 화면 및 클라이언트
│   ├── index.html
│   ├── css/style.css
│   ├── js/
│   │   ├── app.js             # 화면 및 사용자 동작
│   │   ├── config.js          # Firebase 웹 구성 및 로고 경로
│   │   ├── firebase.js        # Firebase 데이터·인증 연동
│   │   └── demo.js            # 브라우저 로컬 미리보기
│   └── assets/                # 원본 로고와 차 사진
├── backend/
│   ├── firestore.rules        # 서버 측 보안 규칙
│   ├── firestore.indexes.json # 인덱스 구성
│   └── README.md              # 데이터 구조와 운영 주의사항
├── .github/workflows/pages.yml # GitHub Pages 배포
├── firebase.json              # Firebase CLI 설정
├── .gitignore
└── README.md
```

프론트엔드: HTML/CSS/JavaScript(ES Modules). 별도의 빌드 없이 정적 호스팅 가능. 백엔드: Firebase Authentication + Cloud Firestore. Firebase JS SDK 11.10.0은 CDN에서 불러옵니다. 별도의 API 서버가 필요하지 않습니다.

## 2. 내 컴퓨터에서 실행

압축 해제 후 터미널에서 `hongjak-tea` 폴더를 열고 실행합니다. Python 3가 필요합니다.

```bash
python -m http.server 8000 --directory frontend
```

브라우저에서 http://localhost:8000 접속. Python 실행 명령이 `python3`인 환경에서는 `python3`를 사용하세요. HTML 파일을 직접 더블 클릭하면 모듈 로딩이 차단될 수 있습니다.

Firebase 구성값이 모두 비어 있으면 미리보기로 작동합니다. 예시 차, 검색, 필터, 시음평, 관리자 기능 체험을 지원하며 변경 사항은 해당 브라우저의 localStorage에만 저장됩니다. Firebase 설정 후 예시 데이터는 실제 DB로 자동 이전되지 않습니다. Firebase 설정이 일부라도 입력된 상태에서 연결이 실패하면 미리보기로 조용히 전환하지 않고 오류를 표시합니다.

## 3. Firebase 연결 (최초 1회)

1. https://console.firebase.google.com 에서 프로젝트를 생성합니다. 무료 Spark 요금제로 시작할 수 있습니다(할당량 및 서비스 제한 적용).
2. 프로젝트 설정 → 일반 → 내 앱에서 웹 앱을 추가합니다. 표시된 `firebaseConfig` 값을 `frontend/js/config.js`에 복사합니다. Firebase 웹 API 키는 공개 구성값입니다. 서비스 계정 JSON 또는 비밀번호와 혼동하지 마세요.
3. Build → Authentication → 시작하기 → Sign-in method에서 **이메일/비밀번호**와 **익명**을 활성화합니다.
4. Build → Firestore Database → 데이터베이스 만들기 → 기본 데이터베이스를 프로덕션 모드로 생성합니다. 위치는 변경하기 어려우므로 한국 이용자 기준 가까운 리전을 검토합니다.
5. Firestore → Rules 탭에서 `backend/firestore.rules` 전체 내용을 붙여넣고 게시합니다. 아래 CLI로 배포해도 됩니다.
6. Authentication → Users → Add user에서 관리자 이메일과 새 비밀번호를 설정합니다. 생성된 UID를 복사합니다.
7. Firestore → Data에서 `admins` 컬렉션을 만들고 문서 ID를 위 UID 그대로 지정합니다. 필드 `role`(string) 값을 `admin`으로 설정합니다. 문서 존재 여부가 권한 기준이며 클라이언트에서 관리자 문서를 추가할 수 없습니다.
8. Authentication → Settings → Authorized domains에 실제 배포 도메인(예: `YOUR-ID.github.io`)과 개발 시 `localhost`를 필요에 따라 추가합니다.
9. 사이트 접속 후 관리자 로그인을 눌러 6번에서 만든 이메일과 비밀번호로 로그인하고 첫 차를 등록합니다.

기존 대화에 적힌 비밀번호는 공개 저장소 및 소스에 포함하지 않았습니다. 새 비밀번호 사용을 권장합니다. 일반 부원은 별도 가입 화면 없이 Firebase 익명 인증을 사용합니다.

## 4. GitHub 업로드 및 배포

GitHub에서 새 빈 저장소를 만든 뒤, 압축 해제한 프로젝트 루트에서 아래 명령을 실행합니다. `YOUR-ID`와 `hongjak-tea`는 본인 계정·저장소 이름으로 수정합니다.

```bash
git init
git add .
git commit -m "Initial Hongjak tea collection"
git branch -M main
git remote add origin https://github.com/YOUR-ID/hongjak-tea.git
git push -u origin main
```

터미널 대신 GitHub Desktop의 Add local repository 또는 GitHub 웹 업로드도 가능합니다. 웹 업로드 시 숨김 폴더 `.github`와 `.gitignore`가 누락되지 않게 확인하세요. GitHub 저장소 → Settings → Pages → Build and deployment → Source에서 **GitHub Actions**를 선택합니다. Actions 탭에서 워크플로를 실행하거나 `main`에 다시 push합니다. 배포 주소는 Pages 설정에서 확인합니다. GitHub Pages는 프론트엔드만 배포합니다. Firestore 규칙은 Firebase에서 별도로 게시해야 합니다.

## 5. Firebase CLI로 백엔드 배포 (선택)

Node.js 설치 후 프로젝트 루트에서 실행합니다.

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules,firestore:indexes
```

`firebase use --add`에서 실제 프로젝트를 선택합니다. GitHub Pages 대신 Firebase Hosting을 사용할 경우 `firebase deploy --only hosting`을 추가로 실행합니다. Firebase 프로젝트 및 GitHub 저장소를 실제 생성하거나 배포한 상태는 아닙니다.

## 6. 기능 및 편집 지점

- 차 종류: 가향차 / 싱글오리진 / 블렌드티 / 동양차 / 허브티 (변경 시 config.js와 firestore.rules를 함께 수정)
- 브랜드, 차 이름, 재고 상태, 설명, 이미지 경로 관리. 원산지 입력 없음.
- 부원: 검색 및 차 분류 필터, 시음평 작성·본인 수정, 평점 1~5.
- 관리자: 등록·수정·보관·복원 및 시음평 삭제. 차 보관 시 시음평 유지.
- 모바일 반응형, 한국어 시스템 폰트, 별도 상단 장식 이미지 및 이모티콘 없음.
- 로고: `frontend/assets`에 원본을 넣고 config.js의 logoPath 변경. 원본이 없으면 텍스트 표시.
- 사진: GitHub에 이미지 파일을 추가하거나 HTTPS 이미지 URL 입력. 이미지 직접 업로드/Cloud Storage는 미구현.

## 7. 공개 전 테스트

- [ ] 미리보기 및 모바일 화면 정상 표시
- [ ] Firebase 연결 및 브라우저 두 개에서 동일 목록 확인
- [ ] 관리자 로그인 및 차 등록/수정/보관/복원
- [ ] 일반 부원의 관리자 기능 차단(보안 규칙으로 직접 쓰기도 거부)
- [ ] 익명 부원의 시음평 작성/수정 및 다른 부원 시음평 수정 차단
- [ ] 관리자 시음평 삭제, 보관된 차의 신규 시음평 차단
- [ ] 로고 원본 및 실제 차 데이터 추가
- [ ] 실제 배포 주소 접속 및 사용량 모니터링

현재 제공되는 것은 소스 패키지입니다. 실제 Firebase 프로젝트 자격 정보가 없으므로 운영 연결 및 보안 규칙의 서버 배포 결과는 별도 검증이 필요합니다. 공개 서비스에서는 닉네임·시음평이 외부에 공개될 수 있으므로 내부 자료만 공개하려면 인증 정책을 변경하세요.

공식 문서: [Firebase 웹 설정](https://firebase.google.com/docs/web/setup) · [익명 인증](https://firebase.google.com/docs/auth/web/anonymous-auth) · [Firestore 보안 규칙](https://firebase.google.com/docs/firestore/security/get-started)

### 검증 결과 및 로컬 단위 테스트

JavaScript 구문 검사와 JSON 형식 검사, 로컬 미리보기 데이터 모듈의 권한·등록·수정·보관·복원·시음평·재시작 저장 단위 테스트를 수행했습니다. Node.js 22 이상에서 `node --test backend/tests/demo.test.mjs`로 재실행할 수 있습니다. 제작 환경의 브라우저 접속이 차단되어 실제 UI 테스트 및 Firebase 연결/보안 규칙 에뮬레이터 테스트는 수행하지 못했습니다. 배포 전 위 체크리스트를 실행하세요. GitHub Free에서 Pages를 쓰려면 일반적으로 공개 저장소를 이용해야 하며, 공개 저장소에는 비밀 정보를 저장하지 마세요.
