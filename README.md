# dragonjs-geometry
SVG 를 사용한 Geometry 그리기 도구

## 리펙토링
1. 코드 간소화
2. 컴포넌트화
  - AS-IS : Function Prototype으로 구성된 모듈형태
  - TO-BE : Component화로 Data, Event, Template 분리
3. 상태관리
  - AS-IS : 상태, 뷰, 이벤트 로직 섞임
  - TO-BE : 상태 중앙 관리 및 로직 분리