export const DefaultActionsMap = {
  list: {
    method: 'get',
    data: 'params',
    type: 'none'
  },
  create: {
    method: 'post',
    data: 'data',
    type: 'tool',
    callback: (action, context) => {
      context.activeData = null
      context.visible = true
      context.modalStatus = 'create'
    }
  },
  delete: {
    method: 'delete',
    data: 'params',
    btnText: '删除',
    tag: 'delete',
    async callback(record, action, context) {
      const { success } = await action.api({ [context.primaryKey]: record[context.primaryKey] })
      if (success) context.getList()
    }
  },
  update: {
    method: 'post',
    data: 'data',
    btnText: '编辑',
    callback: async(record, action, context) => {
      context.activeData = record
      context.visible = true
      context.modalStatus = 'update'
    }
  },
  detail: {
    method: 'get',
    data: 'params',
    btnText: '详情',
    callback: (record, action, context) => {
      context.activeData = record
      context.visible = true
      context.modalStatus = 'looking'
    }
  }
}

export function defaultV(type) {
  switch (type) {
    case 'input':
      return ''
    default:
      return undefined
  }
}
