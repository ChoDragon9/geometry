var svgGeometryArr = [
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
  '--',
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
];

var customEditorArr = [
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
    respon: ['상태패턴 최상위 클래스']
  },
  {
    className: 'FixedRatioState',
    respon: ['고정비 사각형 상태'],
    collabo: ['State']
  },
  {
    className: 'RectangleState',
    respon: ['사각형 상태'],
    collabo: ['State']
  },
  {
    className: 'LineState',
    respon: ['라인 상태'],
    collabo: ['State']
  },
  '--',
  {
    className: '(CustomEditor)CustomEditorV2',
    respon: ['마우스 이벤트를 통해 SVG를 추가함', '드래그 이벤트 추가됨']
  }
]

var drawArr = [
  {
    className: 'Draw',
    respon: [
      '옵션을 받아 어떤 Geometry를 생성함',
      '데이터 로직',
      '이벤트 로직',
      '뷰 로직'
    ],
    collabo: [
      'DrawModel',
      'GroupHelper',
      'WiseFaceDetectionHelper',
      'LineHelper',
      'CircleHelper',
      'TextTagHelper',
      'PolygonHelper',
      'ArrowImageHelper',
      '-',
      'EventController',
      'CommonUtils',
      'FunnyMath'
    ]
  },
  '--',
  {
    className: 'DrawModel',
    respon: ['Draw의 데이터 관리'],
    collabo: [
      'CommonUtils',
      'FunnyMath'
    ]
  },
  {
    className: 'IconHelper',
    respon: ['아이콘 생성 및 조작'],
    collabo: [
      'GroupHelper',
      '-',
      'ElementController'
    ]
  },
  {
    className: 'LineHelper',
    respon: ['line 태그 조작'],
    collabo: [
      'GroupHelper',
      'IconHelper',
      'DrawModel',
      '-',
      'ElementController',
      'FunnyMath'
    ]
  },
  {
    className: 'CircleHelper',
    respon: ['circle 태그 조작'],
    collabo: [
      'GroupHelper',
      'IconHelper',
      'DrawModel',
      '-',
      'ElementController'
    ]
  },
  {
    className: 'GroupHelper',
    respon: ['g 태그 조작'],
    collabo: [
      '-',
      'ElementController'
    ]
  },
  {
    className: 'WiseFaceDetectionHelper',
    respon: ['wise facedetection 관련']
  },
  {
    className: 'TextTagHelper',
    respon: ['text 태그 조작'],
    collabo: [
      'GroupHelper',
      'CircleHelper',
      'DrawModel',
      '-',
      'ElementController'
    ]
  },
  {
    className: 'PolygonHelper',
    respon: ['polygon 태그 조작'],
    collabo: [
      'GroupHelper',
      '-',
      'ElementController'
    ]
  },
  {
    className: 'ArrowImageHelper',
    respon: ['image 태그 조작'],
    collabo: [
      'GroupHelper',
      '-',
      'ElementController',
      'FunnyMath'
    ]
  },
  '--',
  {
    className: 'DrawModel',
    props: [
      'points',
      'isAllSelected'
    ],
    methods: [
      'setIsAllSelectedState',
      'modifyPoints',
      'getRectangleIndex',
      'alignCenter',
      'changeMinSizeOption',
      'changeMaxSizeOption',
      'addAxis',
      'validateAxis',
      'validateAllPoint',
      'setPoints',
      'getPoints',
      'getPointsLength',
      'setAxis',
      'appendAxis',
      'getAxis'
    ]
  },
  {
    className: 'IconHelper',
    props: ['icon', 'iconText'],
    methods: [
      'createIcon',
      'changePosition',
      'show',
      'hide',
      'onClick',
      'onLeave',
      'onContextMenu'
    ]
  },
  {
    className: 'LineHelper',
    props: ['lines'],
    methods: [
      'addLine',
      'setDefaultColor',
      'setSelectColor',
      'appendAll',
      'appendAtLast',
      'bindEvent',
      'removeAll',
      'hide',
      'show',
      'getLines',
      'setLines'
    ]
  },
  {
    className: 'CircleHelper',
    props: ['circles'],
    methods: [
      'addCircle',
      'bindEvent',
      'selectCircle',
      'setDefaultColor',
      'setSelectColor',
      'appendAll',
      'changeRadius',
      'appendAtLast',
      'removeAll',
      'update',
      'isMouseLeave',
      'hide',
      'show',
      'getCircles',
      'setCircles'
    ]
  },
  {
    className: 'GroupHelper',
    props: ['groupId', 'groupTag'],
    methods: [
      'add',
      'remove',
      'moveTopLayer',
      'append',
      'appendChild',
      'removeChild',
      'insertBefore'
    ]
  },
  {
    className: 'WiseFaceDetectionHelper',
    props: ['wiseFaceDetectionCircle'],
    methods: [
      'updateCircle',
      'append',
      'add',
      'remove',
      'changeFillColor'
    ]
  },
  {
    className: 'TextTagHelper',
    props: ['textTag'],
    methods: [
      'addText',
      'append',
      'remove',
      'show',
      'hide',
      'getTextTag',
      'setTextTag'
    ]
  },
  {
    className: 'PolygonHelper',
    props: ['polygon'],
    methods: [
      'addPolygon',
      'append',
      'bindEvent',
      'selectPolygon',
      'remove',
      'setDefaultColor',
      'setSelectColor',
      'getPolygon',
      'setPolygon'
    ]
  },
  {
    className: 'ArrowImageHelper',
    props: [
      'arrowImageContainner',
      'arrowImage',
      'arrowTextContainner',
      'arrowText'
    ],
    methods: [
      'addImage',
      'append',
      'remove',
      'getArrow',
      'changeArrowImage',
      'changeArrow',
      'show',
      'hide',
      'resetData'
    ]
  },
]

var crccs = [].concat(
  // svgGeometryArr, ['-'],
  drawArr,
  // ['-'], customEditorArr
)

Vue.component('omt', {
  props: ['omt'],
  template: `
    <div class="omt">
      <div class="omt-class">
        <i v-if="omt.isAbstract">{{omt.className}}</i>
        <h1 v-else="">{{omt.className}}</h1>
      </div>
      <div class="omt-prop">
        <ol v-if="omt.props">
          <li v-for="prop in omt.props">{{prop}}</li>
        </ol>
      </div>
      <div class="omt-method">
        <ol v-if="omt.methods">
          <li v-for="method in omt.methods">{{method}}</li>
        </ol>
      </div>
    </div>`
})

Vue.component('crcc', {
  props: ['crcc'],
  template: `
    <div class="crcc">
      <div class="crcc-self">
        <div class="crcc-class">
          <h1>Class</h1>
          <p>{{crcc.className}}</p>
        </div>
        <div class="crcc-respon">
          <h1>Responsibility</h1>
          <ol>
            <li v-for="responItem in crcc.respon">{{responItem}}</li>
          </ol>
        </div>
      </div>
      <div class="crcc-collabo" v-if="crcc.collabo">
        <h1>Collaborators</h1>
        <ol>
          <li v-for="collaboItem in crcc.collabo">{{collaboItem}}</li>
        </ol>
      </div>
    </div>`
})

Vue.component('crcc-hr', {
  template: '<div class="crcc-hr">&nbsp;</div>'
})

Vue.component('omt-hr', {
  template: '<div class="omt-hr">&nbsp;</div>'
})

var app = new Vue({
  el: '#design',
  data: {
    crccs: crccs
  }
});