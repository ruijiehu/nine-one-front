<template>
  <div class="content">
    <div class="abilities" v-for="(item, index) in abilities" :key="index">
      <div class="ability_cell">
        <div class="ability_cell_title">{{ item.name }}</div>
        <ul class="ability_detail">
          <li
            v-for="(aitem, aindex) in item.values"
            :key="aindex"
            @click="go(aitem)"
          >
            <img
              class="img-sty"
              :src="require(`../assets/img/index/${aitem.icon}.png`)"
            />
            <div>
              <div class="name">{{ aitem.name }}</div>
              <div class="desc">{{ aitem.desc }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      abilities: [
        {
          name: '低代码能力',
          values: [
            {
              name: '表单构建',
              desc: '通过拖拽生成表单代码',
              icon: 'zdybdsc',
              path: '/tool/build'
            },
            {
              name: '代码生成',
              desc: '快速生成增删改查表单',
              icon: 'bddmsc',
              path: '/tool/gen'
            }
          ]
        },
        {
          name: '文档速查',
          values: [
            {
              name: 'swagger文档',
              icon: 'swwd',
              desc: '本系统接口文档',
              path: '/tool/swagger'
            },
            {
              name: '图表配置',
              icon: 'tbpzcx',
              desc: '常用图表配置查询',
              path: '/tool/chart'
            }
          ]
        },
        {
          name: '工具能力',
          values: [
            {
              name: '正则表达式速查',
              icon: 'jsstck',
              desc: '常用符号解析',
              path: 'http://tools.kuzhazha.com/regexsucha/'
            },
            {
              name: '正则表达式测试',
              icon: 'tbpzcx',
              desc: '匹配验证',
              path: 'https://tool.chinaz.com/regex/'
            },
            {
              name: 'URL编码/解码',
              icon: 'swwd',
              desc: 'urlencode/urldecode',
              path: 'http://www.jsons.cn/urlencode/'
            },
            {
              name: '在线md5',
              icon: 'jsstck',
              desc: 'MD5在线加密',
              path: 'https://md5jiami.bmcx.com/'
            },
            {
              name: 'JSON格式化',
              icon: 'zxucd',
              desc: 'JSON树形查看',
              path: 'https://www.bejson.com/jsonviewernew/'
            },

            {
              name: '在线base64',
              icon: 'bs64hz',
              desc: 'base64、明文互转',
              path: 'https://base64.us/'
            },
            {
              name: '在线unicode',
              icon: 'zxucd',
              desc: '中文、特殊符号传参处理',
              path: 'http://www.jsons.cn/unicode'
            }
          ]
        },
        {
          name: '平台文档',
          values: [
            {
              name: '浙政钉开发文档',
              icon: 'zdybdsc',
              desc: 'sdk能力速查',
              path: 'https://openplatform-portal.dg-work.cn/portal/#/helpdoc?apiType=jsapi&docKey=2675195'
            },
            {
              name: '浙政钉埋点文档',
              icon: 'zdybdsc',
              desc: '语雀文档入口',
              path: 'https://www.yuque.com/sisialing/bcg47r/ywfbnk'
            },
            {
              name: '浙里办API文档',
              icon: 'zdybdsc',
              desc: 'zsbridge能力速查',
              path: 'https://op-irs.zj.gov.cn/mobile/documents/technology/1714076105479'
            },
            {
              name: '浙里办开发资料',
              icon: 'zdybdsc',
              desc: '开发上架规范',
              path: 'http://192.168.1.43/pages/viewpage.action?pageId=38015898'
            },
            {
              name: '微信公众号文档',
              icon: 'zdybdsc',
              desc: '公众号开发速查',
              path: 'https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html'
            }
          ]
        },
        {
          name: '架构参考',
          values: [
            {
              name: '设计模式参考',
              icon: 'sjmsck',
              desc: '23种设计模式案例',
              path: 'https://www.w3cschool.cn/shejimoshi/builder-pattern.html'
            }
          ]
        }
      ]
    }
  },
  methods: {
    go(item) {
      if (item.path.startsWith('http')) {
        window.open(item.path)
      } else {
        this.$router.push(item.path)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  padding-left: 30px;
  padding-top: 37px;
  .abilities {
    width: 98%;
    min-height: 220px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px #e6e8ea;
    margin-bottom: 20px;
    padding: 20px 40px;
    .ability_cell_title {
      font-size: 28px;
      height: 67px;
      line-height: 67px;
      font-family: Source Han Sans CN, Source Han Sans CN-Bold;
      font-weight: 700;
      text-align: left;
      color: #5a6085;
      border-bottom: 1px solid #f5f7fd;
    }
    .ability_detail {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
      li {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        width: 20%;
        // border: 1px solid #ccc;
        margin-right: 60px;
        margin-bottom: 20px;
        list-style: none;
        border-radius: 2px;
        cursor: pointer;
        &:hover{
          opacity: 0.8;
        }
        .img-sty {
          width: 46px;
          height: 46px;
          margin-right: 20px;
        }
        .name {
          font-size: 24px;
          font-family: Source Han Sans CN, Source Han Sans CN-Bold;
          font-weight: 700;
          text-align: left;
          color: #5a6085;
        }
        .desc {
          margin-top: 12px;
          font-size: 20px;
          font-family: Source Han Sans CN, Source Han Sans CN-Regular;
          font-weight: 400;
          text-align: left;
          color: #999999;
        }
      }
    }
  }
}
</style>
