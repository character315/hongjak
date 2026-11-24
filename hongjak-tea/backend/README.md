# Firebase 백엔드

별도 Node.js API 서버가 아닌 Firebase Authentication + Cloud Firestore(BaaS) 구조입니다. 인증 및 데이터 저장은 Firebase가 담당하고, `firestore.rules`가 서버 측 권한을 검증합니다.

| 경로 | 필드 | 권한 |
|---|---|---|
| `admins/{uid}` | `role: "admin"` (문서 존재 여부가 권한 기준) | 본인 문서 읽기만 가능. 관리자 지정은 Firebase Console에서만 |
| `teas/{teaId}` | name, brand, category, stock, description, imageUrl, archived, createdAt, updatedAt | 공개 읽기, 관리자 생성·수정·보관 |
| `teas/{teaId}/reviews/{uid}` | author, body, rating, createdAt, updatedAt | 활성 차의 시음평 공개 읽기, 인증된 작성자 본인 생성·수정, 관리자 삭제 |

차 삭제는 `archived: true`를 적용하는 소프트 삭제로, 시음평을 보존합니다. 공개 카탈로그의 보관된 차 데이터는 기밀이 아닙니다. 익명 인증 UID는 시음평 문서 ID로 사용되므로 공개될 수 있습니다. 실명이나 민감한 정보는 입력하지 마세요. 브라우저 데이터 삭제 또는 기기 변경 후에는 기존 익명 계정의 시음평 수정 권한을 잃을 수 있습니다. 관리자 권한은 비밀번호 인증 및 관리자 UID 등록을 모두 요구합니다. Firebase 웹 설정값은 공개용이지만 서비스 계정 키/관리자 비밀번호는 절대 저장소에 넣지 마세요.

정식 공개 전 App Check 적용, 사용량 모니터링, 악성 리뷰 대응 정책, 백업 계획을 검토하세요. 익명 인증 한 계정당 차별 시음평 하나로 제한하지만 계정을 재생성하는 스팸까지 막지는 않습니다.
