// {
//   className: 'FunnyMath',
//   respon: [
//     ''
//   ],
//   collabo: [
//     ''
//   ]
// }
var app = new Vue({
  el: '#design',
  data: {
    items: [
      {
        className: 'SVG Geometry',
        respon: [
          'SVG 기술을 사용한 Geometry 드로윙 도구'
        ],
        collabo: [
          'SVG Geometry Product'
        ]
      },
      {
        className: 'SVG Geometry Product',
        respon: ['<svg> 태그를 직접 컨트롤']
      },
      '-',
      {
        className: 'FunnyMath',
        respon: ['수학 함수 객체']
      },
      {
        className: 'EventController',
        respon: ['이벤트 함수 객체']
      },
      {
        className: 'CommonUtils',
        respon: ['유틸 객체']
      },
      {
        className: 'ElementController',
        respon: ['DOM 조작']
      },
      '-',
      {
        className: 'Draw',
        respon: ['SVG를 드로윙'],
        collabo: [
          'GeometryManager',
          'GroupHelper',
          'WiseFaceDetectionHelper',
          'LineHelper',
          'CircleHelper',
          'TextTagHelper',
          'PolygonHelper',
          'ArrowImageHelper'
        ]
      },
      {
        className: 'IconHelper',
        respon: ['']
      },
      {
        className: 'LineHelper',
        respon: [''],
        collabo: ['IconHelper']
      },
      {
        className: 'CircleHelper',
        respon: [''],
        collabo: ['IconHelper']
      },
      {
        className: 'GeometryManager',
        respon: ['']
      },
      {
        className: 'GroupHelper',
        respon: ['']
      },
      {
        className: 'WiseFaceDetectionHelper',
        respon: ['']
      },
      {
        className: 'TextTagHelper',
        respon: ['']
      },
      {
        className: 'PolygonHelper',
        respon: ['']
      },
      {
        className: 'ArrowImageHelper',
        respon: ['']
      },
      '-',
      {
        className: 'CustomEditor',
        respon: ['마우스 이벤트를 통해 SVG를 추가함'],
        collabo: [
          '(State)FixedRatioState',
          '(State)RectangleState',
          '(State)LineState'
        ]
      },
      {
        className: 'State',
        respon: ['']
      },
      {
        className: 'FixedRatioState',
        respon: [''],
        collabo: ['State']
      },
      {
        className: 'RectangleState',
        respon: [''],
        collabo: ['State']
      },
      {
        className: 'LineState',
        respon: [''],
        collabo: ['State']
      },
      '-',
      {
        className: '(CustomEditor)CustomEditorV2',
        respon: ['마우스 이벤트를 통해 SVG를 추가함', '드래그 이벤트 추가됨']
      }
    ]
  }
});