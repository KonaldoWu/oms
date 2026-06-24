var ROLES = {
    investment_manager: { name: '投资经理', label: '张明', dept: '创新金融业务总部', group: '专户投资组', investGroups: ['专户投资组','xn账户'] },
    trader: { name: '交易员', label: '李华', dept: '创新金融业务总部', group: '专户投资组', investGroups: ['专户投资组','xn账户'] },
    risk_control: { name: '部门风控', label: '刘伟', dept: '创新金融业务总部', group: '', investGroups: [] },
    department_leader: { name: '部门领导', label: '孙磊', dept: '创新金融业务总部', group: '', investGroups: [] },
    financial_staff: { name: '财务人员', label: '赵静', dept: '财务结算部', group: '', investGroups: [] },
    company_leader: { name: '公司领导', label: '陈总', dept: '总裁办公室', group: '', investGroups: [] },
    admin: { name: '平台管理员', label: '管理员', dept: '信息技术部', group: '', investGroups: [] },
    demo: { name: '演示账号', label: 'Demo', dept: '信息技术部', group: '', investGroups: [] }
};

var PERMISSIONS = {
    investment_manager: { viewHome:1, uploadPlan:1, submitPlan:1, createTrade:1, addProduct:0, editProduct:0, submitProduct:0, submitCounterparty:0, batchImportProduct:0, approvePlan:0, approveProduct:0, approveCounterparty:0, approveTradeRisk:0, approveTradeFinance:0, confirmVoucher:0, pushNC:0, viewReport:1, manageUser:0, dataScope:'investGroup' },
    trader: { viewHome:1, uploadPlan:0, submitPlan:0, createTrade:1, addProduct:0, editProduct:0, submitProduct:0, submitCounterparty:0, batchImportProduct:0, approvePlan:0, approveProduct:0, approveCounterparty:0, approveTradeRisk:0, approveTradeFinance:0, confirmVoucher:0, pushNC:0, viewReport:1, manageUser:0, dataScope:'investGroup' },
    risk_control: { viewHome:1, uploadPlan:0, submitPlan:0, createTrade:0, addProduct:1, editProduct:1, submitProduct:1, submitCounterparty:0, batchImportProduct:1, approvePlan:1, approveProduct:1, approveCounterparty:0, approveTradeRisk:0, approveTradeFinance:0, confirmVoucher:0, pushNC:0, viewReport:1, manageUser:0, dataScope:'department' },
    department_leader: { viewHome:1, uploadPlan:0, submitPlan:0, createTrade:0, addProduct:0, editProduct:0, submitProduct:0, submitCounterparty:0, batchImportProduct:0, approvePlan:1, approveProduct:0, approveCounterparty:0, approveTradeRisk:0, approveTradeFinance:0, confirmVoucher:0, pushNC:0, viewReport:1, manageUser:0, dataScope:'department' },
    financial_staff: { viewHome:1, uploadPlan:0, submitPlan:0, createTrade:0, addProduct:0, editProduct:0, submitProduct:0, submitCounterparty:0, batchImportProduct:0, approvePlan:0, approveProduct:0, approveCounterparty:0, approveTradeRisk:0, approveTradeFinance:0, confirmVoucher:0, pushNC:0, viewReport:1, manageUser:0, dataScope:'allFinance' },
    company_leader: { viewHome:1, uploadPlan:0, submitPlan:0, createTrade:0, addProduct:0, editProduct:0, submitProduct:0, submitCounterparty:0, batchImportProduct:0, approvePlan:0, approveProduct:0, approveCounterparty:0, approveTradeRisk:0, approveTradeFinance:0, confirmVoucher:0, pushNC:0, viewReport:1, manageUser:0, dataScope:'all' },
    admin: { viewHome:1, uploadPlan:0, submitPlan:0, createTrade:0, addProduct:0, editProduct:0, submitProduct:0, submitCounterparty:0, batchImportProduct:0, approvePlan:0, approveProduct:0, approveCounterparty:0, approveTradeRisk:0, approveTradeFinance:0, confirmVoucher:0, pushNC:0, viewReport:0, manageUser:1, dataScope:'all' },
    demo: { viewHome:1, uploadPlan:1, submitPlan:1, createTrade:1, addProduct:1, editProduct:1, submitProduct:1, submitCounterparty:1, batchImportProduct:1, approvePlan:1, approveProduct:1, approveCounterparty:1, approveTradeRisk:1, approveTradeFinance:1, confirmVoucher:1, pushNC:1, viewReport:1, manageUser:1, dataScope:'all' }
};

var MENU_CONFIG = [
    { href: 'investment_manager.html', icon: '📊', label: '监控看板', roles: ['investment_manager','trader','risk_control','department_leader','financial_staff','company_leader','admin','demo'] },
    { href: 'trade.html', icon: '💹', label: '交易管理', roles: ['investment_manager','trader','risk_control','department_leader','company_leader','admin','demo'] },
    { href: 'product.html', icon: '📦', label: '产品管理', roles: ['investment_manager','trader','risk_control','department_leader','company_leader','admin','demo'] },
    { href: 'counterparty.html', icon: '🏢', label: '对手方管理', roles: ['investment_manager','trader','risk_control','department_leader','company_leader','admin','demo'] },
    { href: 'approval.html', icon: '✅', label: '审批中心', roles: ['investment_manager','trader','risk_control','department_leader','financial_staff','company_leader','admin','demo'] },
    { href: 'finance.html', icon: '💰', label: '财务核算', roles: ['financial_staff','company_leader','admin','demo'] },
    { href: 'user.html', icon: '👤', label: '权限管理', roles: ['admin','demo'] },
    { href: 'system.html', icon: '⚙', label: '系统管理', roles: ['admin','demo'] }
];

function getCurrentRoleKey() {
    return sessionStorage.getItem('oms_role') || 'investment_manager';
}

function getCurrentRole() {
    return ROLES[getCurrentRoleKey()] || ROLES.investment_manager;
}

function getCurrentPerms() {
    return PERMISSIONS[getCurrentRoleKey()] || PERMISSIONS.investment_manager;
}

function hasPermission(permKey) {
    var perms = getCurrentPerms();
    return perms[permKey] === 1;
}

function isReadOnly() {
    var roleKey = getCurrentRoleKey();
    return roleKey === 'company_leader';
}

function canEdit() {
    return !isReadOnly();
}

function canApprove() {
    var roleKey = getCurrentRoleKey();
    return roleKey === 'risk_control' || roleKey === 'department_leader' || roleKey === 'financial_staff';
}

var PRODUCTS = [
    { id: 'P001', name: '第一创业天玑13号单一资产管理计划', shortName: '天玑13号', assetType: '专户资管产品', productType: '混合型', accountType: '专户资管', hengtaiCode: 'XT20260301001', externalCode: '', dept: '创新金融业务总部', group: '专户投资组', expireDate: '', redeemable: true, status: '在投', nav: 1.0234, navDate: '2026-05-17', holdAmount: 15000000, holdShares: 14654321, planAmount: 20000000, usedAmount: 15000000, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2026-03-01', description: '第一创业天玑13号单一资管计划' },
    { id: 'P002', name: '国金资管盛乾同行2号F0F单一资产管理计划', shortName: '盛乾同行2号', assetType: '专户资管产品', productType: 'FOF', accountType: '专户资管', hengtaiCode: 'XT20260305001', externalCode: '', dept: '创新金融业务总部', group: '专户投资组', expireDate: '', redeemable: true, status: '在投', nav: 0.9876, navDate: '2026-05-17', holdAmount: 12000000, holdShares: 12150486, planAmount: 15000000, usedAmount: 12000000, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2026-03-05', description: '国金资管盛乾同行2号FOF' },
    { id: 'P003', name: '第一创业尊享FOF55号单一资产管理计划', shortName: '尊享FOF55号', assetType: '信托', productType: 'FOF', accountType: '信托', hengtaiCode: 'XT20260410001', externalCode: '', dept: 'FICC固定收益业务总部', group: '理财投资组', expireDate: '2027-12-31', redeemable: true, status: '无计划', nav: 1.0000, navDate: '', holdAmount: 0, holdShares: 0, planAmount: 8000000, usedAmount: 0, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2026-04-10', description: '第一创业尊享FOF55号' },
    { id: 'P004', name: '国泰君安君得3640单一资产管理计划', shortName: '国君君得3640', assetType: 'ABS(中保登)', productType: '固收类', accountType: 'ABS', hengtaiCode: 'ABS20260519001', externalCode: '1101010901', dept: '创新金融业务总部', group: 'fb账户', expireDate: '2027-06-30', redeemable: true, status: '在投', nav: 1.0512, navDate: '2026-05-17', holdAmount: 8000000, holdShares: 7610290, planAmount: 10000000, usedAmount: 8000000, counterparty: 'CP001', tradeLimit: 5000000, accountMapping: '{"debit":"1101-交易性金融资产","credit":"1002-银行存款"}', poolUser: '刘伟', poolTime: '2025-09-10', description: '国泰君安君得3640 ABS产品' },
    { id: 'P005', name: '中信证券资管财富私享投资3791号FOF单一资产管理计划', shortName: '中信财富3791号FOF', assetType: '专户资管产品', productType: 'FOF', accountType: '专户资管', hengtaiCode: 'XT20250910002', externalCode: '', dept: '创新金融业务总部', group: 'xn账户', expireDate: '', redeemable: true, status: '在投', nav: 1.0156, navDate: '2026-05-16', holdAmount: 5000000, holdShares: 4923160, planAmount: 6000000, usedAmount: 5000000, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2025-09-10', description: '中信证券资管财富私享3791号FOF' },
    { id: 'P006', name: '中金财富私享1554号FOF单一资产管理计划', shortName: '中金财富1554号FOF', assetType: '专户资管产品', productType: 'FOF', accountType: '专户资管', hengtaiCode: 'XT20260501001', externalCode: '', dept: '创新金融业务总部', group: 'xn账户', expireDate: '', redeemable: true, status: '无计划', nav: 1.0000, navDate: '', holdAmount: 0, holdShares: 0, planAmount: 5000000, usedAmount: 0, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2026-05-01', description: '中金财富私享1554号FOF' },
    { id: 'P007', name: '第一创业源泉优享FOF3号单一资产管理计划', shortName: '一创优享FOF3号', assetType: '专户资管产品', productType: '混合型', accountType: '专户资管', hengtaiCode: 'XT20250615001', externalCode: '', dept: '创新金融业务总部', group: '专户投资组', expireDate: '', redeemable: true, status: '无计划', nav: 1.0800, navDate: '2026-04-30', holdAmount: 10000000, holdShares: 9259259, planAmount: 10000000, usedAmount: 10000000, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2025-06-15', description: '第一创业源泉优享FOF3号' },
    { id: 'P008', name: '国金资管盛乾同行5号F0F单一资产管理计划', shortName: '国金盛乾同行5号', assetType: '专户资管产品', productType: 'FOF', accountType: '专户资管', hengtaiCode: 'XT20260120001', externalCode: '', dept: '创新金融业务总部', group: '专户投资组', expireDate: '', redeemable: true, status: '无计划', nav: 1.0320, navDate: '2026-05-15', holdAmount: 3000000, holdShares: 2906977, planAmount: 5000000, usedAmount: 3000000, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2026-01-20', description: '国金资管盛乾同行5号FOF' },
    { id: 'P009', name: '华泰银泰21号单一资产管理计划', shortName: '华泰银泰21号', assetType: '专户资管产品', productType: '固收类', accountType: '专户资管', hengtaiCode: 'XT20251105001', externalCode: '', dept: 'FICC固定收益业务总部', group: '理财投资组', expireDate: '', redeemable: true, status: '在投', nav: 1.0180, navDate: '2026-05-17', holdAmount: 20000000, holdShares: 19646522, planAmount: 25000000, usedAmount: 20000000, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2025-11-05', description: '华泰银泰21号固收类资管计划' },
    { id: 'P010', name: '易米基金元睿一号单一资产管理计划', shortName: '易米元睿一号', assetType: '专户资管产品', productType: '权益类', accountType: '专户资管', hengtaiCode: 'XT20260210001', externalCode: '', dept: '证券投资部', group: '权益投资组', expireDate: '2027-12-31', redeemable: true, status: '在投', nav: 0.9620, navDate: '2026-05-17', holdAmount: 8000000, holdShares: 8316008, planAmount: 10000000, usedAmount: 8000000, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2026-02-10', description: '易米基金元睿一号权益类资管计划' },
    { id: 'P011', name: '中保登某ABS产品', shortName: '中保登ABS', assetType: 'ABS(中保登)', productType: '固收类', accountType: 'ABS', hengtaiCode: 'ABS20250315001', externalCode: '1101010903', dept: '创新金融业务总部', group: 'fb账户', expireDate: '2027-03-15', redeemable: true, status: '在投', nav: 1.0650, navDate: '2026-05-10', holdAmount: 5000000, holdShares: 4694836, planAmount: 5000000, usedAmount: 5000000, counterparty: 'CP002', tradeLimit: 3000000, accountMapping: '{"debit":"1101-交易性金融资产","credit":"1002-银行存款"}', poolUser: '刘伟', poolTime: '2025-03-15', description: '中保登ABS产品' }
];

var COUNTERPARTIES = [
    { id: 'CP001', name: '国泰君安证券股份有限公司', shortName: '国泰君安', type: '证券公司', productCount: 1, status: '在池', contact: '张经理', phone: '021-3867-xxxx', email: 'zhang@gtja.com', planFile: '国泰君安用资计划书.pdf', poolUser: '刘伟', poolTime: '2025-09-08 10:00' },
    { id: 'CP002', name: '第一创业证券股份有限公司', shortName: '第一创业', type: '证券公司', productCount: 2, status: '在池', contact: '王经理', phone: '0755-2583-xxxx', email: 'wang@fcsc.com', planFile: '第一创业用资计划书.pdf', poolUser: '刘伟', poolTime: '2025-06-10 14:00' },
    { id: 'CP003', name: '国金证券股份有限公司', shortName: '国金证券', type: '证券公司', productCount: 2, status: '在池', contact: '李经理', phone: '028-8669-xxxx', email: 'li@gjzq.com', planFile: '国金证券用资计划书.pdf', poolUser: '刘伟', poolTime: '2026-01-15 09:00' },
    { id: 'CP004', name: '中金公司财富管理部', shortName: '中金财富', type: '证券公司', productCount: 1, status: '在池', contact: '赵经理', phone: '010-6505-xxxx', email: 'zhao@cicc.com', planFile: '中金财富用资计划书.pdf', poolUser: '刘伟', poolTime: '2025-09-10 11:00' },
    { id: 'CP005', name: '中信证券资产管理有限公司', shortName: '中信资管', type: '资管公司', productCount: 1, status: '在池', contact: '陈经理', phone: '010-6083-xxxx', email: 'chen@citics.com', planFile: '中信资管用资计划书.pdf', poolUser: '刘伟', poolTime: '2025-09-10 11:00' },
    { id: 'CP006', name: '中保登某发行机构', shortName: '中保登发行', type: '资管公司', productCount: 1, status: '禁用', contact: '', phone: '', email: '', planFile: '', poolUser: '刘伟', poolTime: '2025-03-10 09:00' },
    { id: 'CP007', name: '华泰证券资产管理有限公司', shortName: '华泰资管', type: '资管公司', productCount: 0, status: '待入池', contact: '周经理', phone: '025-8338-xxxx', email: 'zhou@htsam.com', planFile: '华泰资管用资计划书.pdf', poolUser: '刘伟', poolTime: '' }
];

var PLANS = [
    { id: 'TP20260301001', name: '2026年第一季度天玑13号投资计划', dept: '创新金融业务总部', group: '专户投资组', trader: '李华', totalAmount: 20000000, usedAmount: 15000000, status: '已通过', creator: '张明', createTime: '2026-03-01 09:30', submitTime: '2026-03-01 09:30', file: '天玑13号投资计划书.docx', products: ['P001'], remark: '天玑13号建仓计划' },
    { id: 'TP20260305001', name: '2026年Q1盛乾同行系列投资计划', dept: '创新金融业务总部', group: '专户投资组', trader: '李华', totalAmount: 30000000, usedAmount: 12000000, status: '已通过', creator: '张明', createTime: '2026-03-05 10:00', submitTime: '2026-03-05 10:00', file: '盛乾同行系列投资计划书.docx', products: ['P002', 'P003'], remark: '盛乾同行2号和FOF55号组合投资' },
    { id: 'TP20260501001', name: '2026年5月中金财富FOF投资计划', dept: '创新金融业务总部', group: 'xn账户', trader: '李华', totalAmount: 11000000, usedAmount: 5000000, status: '已通过', creator: '张明', createTime: '2026-05-01 14:00', submitTime: '2026-05-01 14:00', file: '中金财富1554号投资计划书.docx', products: ['P005', 'P006'], remark: '中金财富FOF组合投资' },
    { id: 'TP20260515001', name: '2026年5月ABS专项投资计划', dept: '创新金融业务总部', group: 'fb账户', trader: '李华', totalAmount: 10000000, usedAmount: 8000000, status: '待审批', creator: '张明', createTime: '2026-05-15 09:30', submitTime: '2026-05-15 09:30', file: 'ABS专项投资计划书.docx', products: ['P004'], remark: '国君君得3640 ABS投资' },
    { id: 'TP20260518001', name: '2026年5月FICC固收投资计划', dept: 'FICC固定收益业务总部', group: '理财投资组', trader: '赵丽', totalAmount: 25000000, usedAmount: 0, status: '草稿', creator: '王强', createTime: '2026-05-18 10:00', submitTime: '', file: 'FICC固收投资计划书.pdf', products: ['P009'], remark: '华泰银泰21号固收投资' },
    { id: 'TP20260401001', name: '2026年Q1权益投资计划', dept: '证券投资部', group: '权益投资组', trader: '陈芳', totalAmount: 10000000, usedAmount: 8000000, status: '已通过', creator: '周欣', createTime: '2026-04-01 11:00', submitTime: '2026-04-01 11:00', file: '易米元睿一号投资计划书.docx', products: ['P010'], remark: '易米元睿一号权益投资' },
    { id: 'TP20260201001', name: '2026年Q1初始投资计划', dept: '创新金融业务总部', group: '专户投资组', trader: '李华', totalAmount: 10000000, usedAmount: 10000000, status: '已通过', creator: '张明', createTime: '2026-02-01 09:00', submitTime: '2026-02-01 09:00', file: 'Q1初始投资计划书.docx', products: ['P007'], remark: '一创优享FOF3号已完结' },
    { id: 'TP20260421001', name: '2026年4月天玑系列追加投资计划', dept: '创新金融业务总部', group: '专户投资组', trader: '李华', totalAmount: 15000000, usedAmount: 8000000, status: '已通过', creator: '张明', createTime: '2026-04-21 10:00', submitTime: '2026-04-21 10:00', file: '天玑系列追加投资计划书.docx', products: ['P001', 'P002'], remark: '天玑13号与盛乾同行组合追加' },
    { id: 'TP20260423001', name: '2026年4月专户FOF组合投资计划', dept: '创新金融业务总部', group: '专户投资组', trader: '李华', totalAmount: 12000000, usedAmount: 5000000, status: '已通过', creator: '张明', createTime: '2026-04-23 09:30', submitTime: '2026-04-23 09:30', file: '专户FOF组合投资计划书.docx', products: ['P003'], remark: '尊享FOF55号建仓计划' },
    { id: 'TP20260423002', name: '2026年4月xn账户固收投资计划', dept: '创新金融业务总部', group: 'xn账户', trader: '李华', totalAmount: 18000000, usedAmount: 13000000, status: '已通过', creator: '张明', createTime: '2026-04-23 14:00', submitTime: '2026-04-23 14:00', file: 'xn账户固收投资计划书.pdf', products: ['P004', 'P005'], remark: '国君君得与中信财富组合投资' },
    { id: 'TP20260422001', name: '2026年4月FICC理财投资计划', dept: 'FICC固定收益业务总部', group: '理财投资组', trader: '赵丽', totalAmount: 25000000, usedAmount: 20000000, status: '已通过', creator: '王强', createTime: '2026-04-22 10:00', submitTime: '2026-04-22 10:00', file: 'FICC理财投资计划书.docx', products: ['P009'], remark: '华泰银泰21号固收投资' },
    { id: 'TP20260420001', name: '2026年4月fb账户ABS投资计划', dept: '创新金融业务总部', group: 'fb账户', trader: '李华', totalAmount: 8000000, usedAmount: 5000000, status: '已驳回', creator: '张明', createTime: '2026-04-20 09:00', submitTime: '2026-04-20 09:00', file: 'fb账户ABS投资计划书.docx', products: ['P011'], remark: '中保登ABS产品投资，风控驳回' },
    { id: 'TP20260520001', name: '2026年5月权益追加投资计划', dept: '证券投资部', group: '权益投资组', trader: '陈芳', totalAmount: 5000000, usedAmount: 0, status: '已终止', creator: '周欣', createTime: '2026-05-20 10:00', submitTime: '2026-05-20 10:00', file: '权益追加投资计划书.docx', products: ['P010'], remark: '市场变化终止' }
];

var TRADES = [
    { id: 'TRX20260310001', planId: 'TP20260301001', productId: 'P001', productName: '天玑13号', type: '买入', applyAmount: 10000000, shares: '', expectedDate: '', dealAmount: 10000000, status: '已成交', trader: '李华', createTime: '2026-03-10 14:00', remark: '' },
    { id: 'TRX20260315001', planId: 'TP20260301001', productId: 'P001', productName: '天玑13号', type: '买入', applyAmount: 5000000, shares: '', expectedDate: '', dealAmount: 5000000, status: '已成交', trader: '李华', createTime: '2026-03-15 10:00', remark: '追加投资' },
    { id: 'TRX20260401001', planId: 'TP20260305001', productId: 'P002', productName: '盛乾同行2号', type: '买入', applyAmount: 12000000, shares: '', expectedDate: '', dealAmount: 12000000, status: '已成交', trader: '李华', createTime: '2026-04-01 09:30', remark: '' },
    { id: 'TRX20260510001', planId: 'TP20260501001', productId: 'P005', productName: '中信财富3791号FOF', type: '买入', applyAmount: 5000000, shares: '', expectedDate: '', dealAmount: 5000000, status: '已成交', trader: '李华', createTime: '2026-05-10 11:00', remark: '' },
    { id: 'TRX20260516001', planId: 'TP20260515001', productId: 'P004', productName: '国君君得3640', type: '买入', applyAmount: 8000000, shares: '', expectedDate: '', dealAmount: 0, status: '审批中', trader: '李华', createTime: '2026-05-16 14:00', remark: 'ABS建仓' },
    { id: 'TRX20260517001', planId: 'TP20260301001', productId: 'P001', productName: '天玑13号', type: '赎回', applyAmount: 3000000, shares: '', expectedDate: '', dealAmount: 0, status: '待审批', trader: '李华', createTime: '2026-05-17 10:00', remark: '部分赎回' },
    { id: 'TRX20260518001', planId: 'TP20260501001', productId: 'P006', productName: '中金财富1554号FOF', type: '买入', applyAmount: 5000000, shares: '', expectedDate: '', dealAmount: 0, status: '待执行', trader: '李华', createTime: '2026-05-18 09:00', remark: '' },
    { id: 'TRX20260505001', planId: 'TP20260401001', productId: 'P010', productName: '易米元睿一号', type: '买入', applyAmount: 8000000, shares: '', expectedDate: '', dealAmount: 8000000, status: '已成交', trader: '陈芳', createTime: '2026-05-05 14:00', remark: '' },
    { id: 'TRX20260512001', planId: 'TP20260305001', productId: 'P003', productName: '尊享FOF55号', type: '买入', applyAmount: 8000000, shares: '', expectedDate: '', dealAmount: 0, status: '已撤回', trader: '李华', createTime: '2026-05-12 11:00', remark: '市场波动撤回' },
    { id: 'TRX20260514001', planId: 'TP20260515001', productId: 'P004', productName: '国君君得3640', type: '买入', applyAmount: 2000000, shares: '', expectedDate: '', dealAmount: 0, status: '已驳回', trader: '李华', createTime: '2026-05-14 15:00', remark: '额度超限' }
];

var APPROVALS = [
    { id: 'APR20260515001', type: '投资计划书审批', object: 'TP20260515001', objectName: '2026年5月ABS专项投资计划', applicant: '张明', applyTime: '2026-05-15 09:30', status: '审批中', steps: [{title: '投资经理提交', user: '张明', time: '2026-05-15 09:30', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '', status: '当前'}, {title: '部门负责人审批', user: '孙磊', time: '', status: '待处理'}] },
    { id: 'APR20260518001', type: '投资计划书审批', object: 'TP20260518001', objectName: '2026年5月FICC固收投资计划', applicant: '王强', applyTime: '2026-05-18 10:00', status: '审批中', steps: [{title: '投资经理提交', user: '王强', time: '2026-05-18 10:00', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-05-18 14:30', status: '已完成'}, {title: '部门负责人审批', user: '孙磊', time: '', status: '当前'}] },
    { id: 'APR20260301001', type: '投资计划书审批', object: 'TP20260301001', objectName: '2026年Q1天玑13号投资计划', applicant: '张明', applyTime: '2026-03-01 09:30', status: '已通过', steps: [{title: '投资经理提交', user: '张明', time: '2026-03-01 09:30', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-03-01 14:20', status: '已完成'}, {title: '部门负责人审批', user: '孙磊', time: '2026-03-02 10:00', status: '已完成'}] },
    { id: 'APR20260420001', type: '投资计划书审批', object: 'TP20260420001', objectName: '2026年4月fb账户ABS投资计划', applicant: '张明', applyTime: '2026-04-20 09:00', status: '已驳回', steps: [{title: '投资经理提交', user: '张明', time: '2026-04-20 09:00', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-04-20 15:00', status: '已完成', result: '驳回', reason: 'ABS产品额度超限，请调整后重新提交'}, {title: '部门负责人审批', user: '孙磊', time: '', status: '待处理'}] },
    { id: 'APR20260520001', type: '投资计划书审批', object: 'TP20260520001', objectName: '2026年5月权益追加投资计划', applicant: '周欣', applyTime: '2026-05-20 10:00', status: '已终止', steps: [{title: '投资经理提交', user: '周欣', time: '2026-05-20 10:00', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '', status: '待处理'}, {title: '部门负责人审批', user: '孙磊', time: '', status: '待处理'}] },
    { id: 'APR20260519001', type: '产品入池审批', object: 'P004', objectName: '国君君得3640', applicant: '刘伟', applyTime: '2026-05-19 09:00', status: '已通过', steps: [{title: '风控提交', user: '刘伟', time: '2026-05-19 09:00', status: '已完成'}, {title: '入池生效', user: '系统', time: '2026-05-19 09:05', status: '已完成'}] },
    { id: 'APR20260521001', type: '产品入池审批', object: 'P006', objectName: '中金财富1554号FOF', applicant: '刘伟', applyTime: '2026-05-21 10:00', status: '审批中', steps: [{title: '风控提交', user: '刘伟', time: '2026-05-21 10:00', status: '已完成'}, {title: '入池生效', user: '系统', time: '', status: '当前'}] },
    { id: 'APR20260522001', type: '产品入池审批', object: 'P003', objectName: '尊享FOF55号', applicant: '刘伟', applyTime: '2026-05-22 14:00', status: '审批中', steps: [{title: '风控提交', user: '刘伟', time: '2026-05-22 14:00', status: '已完成'}, {title: '入池生效', user: '系统', time: '', status: '当前'}] }
];

var FINANCES = [
    { id: 'FR20260517001', productId: 'P001', productName: '天玑13号', changeType: '兑息兑付', changeDate: '2026-05-17', changeAmount: 500000, voucherStatus: '待确认', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260517001' },
    { id: 'FR20260517002', productId: 'P002', productName: '盛乾同行2号', changeType: '公允价值变更', changeDate: '2026-05-17', changeAmount: 300000, voucherStatus: '待确认', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260517002' },
    { id: 'FR20260516001', productId: 'P004', productName: '国君君得3640', changeType: '申购', changeDate: '2026-05-16', changeAmount: 8000000, voucherStatus: '待确认', createMethod: '自动生成', source: '交易确认', voucherId: 'VCH20260517003' },
    { id: 'FR20260515001', productId: 'P005', productName: '中信财富3791号FOF', changeType: '兑息兑付', changeDate: '2026-05-15', changeAmount: 120000, voucherStatus: '已确认', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260515001' },
    { id: 'FR20260510001', productId: 'P001', productName: '天玑13号', changeType: '公允价值变更', changeDate: '2026-05-10', changeAmount: 450000, voucherStatus: '已确认', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260510001' },
    { id: 'FR20260505001', productId: 'P009', productName: '华泰银泰21号', changeType: '兑息兑付', changeDate: '2026-05-05', changeAmount: 200000, voucherStatus: '已推送NC', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260505001' },
    { id: 'FR20260430001', productId: 'P010', productName: '易米元睿一号', changeType: '公允价值变更', changeDate: '2026-04-30', changeAmount: -380000, voucherStatus: '已推送NC', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260430001' },
    { id: 'FR20260425001', productId: 'P007', productName: '一创优享FOF3号', changeType: '赎回', changeDate: '2026-04-25', changeAmount: 10000000, voucherStatus: '已推送NC', createMethod: '自动生成', source: '交易确认', voucherId: 'VCH20260425001' }
];

var VOUCHERS = [
    { id: 'VCH20260517001', summary: '天玑13号兑息兑付', debitAccount: '1122-应收利息', creditAccount: '6001-投资收益', amount: 500000, maker: '系统', makeTime: '2026-05-17 17:30' },
    { id: 'VCH20260517002', summary: '盛乾同行2号公允价值变动', debitAccount: '1101-交易性金融资产', creditAccount: '6101-公允价值变动损益', amount: 300000, maker: '系统', makeTime: '2026-05-17 17:30' },
    { id: 'VCH20260515001', summary: '中信财富3791号FOF兑息兑付', debitAccount: '1122-应收利息', creditAccount: '6001-投资收益', amount: 120000, maker: '系统', makeTime: '2026-05-15 17:30' },
    { id: 'VCH20260510001', summary: '天玑13号公允价值变动', debitAccount: '1101-交易性金融资产', creditAccount: '6101-公允价值变动损益', amount: 450000, maker: '系统', makeTime: '2026-05-10 17:30' },
    { id: 'VCH20260505001', summary: '华泰银泰21号兑息兑付', debitAccount: '1122-应收利息', creditAccount: '6001-投资收益', amount: 200000, maker: '系统', makeTime: '2026-05-05 17:30' },
    { id: 'VCH20260430001', summary: '易米元睿一号公允价值变动', debitAccount: '6101-公允价值变动损益', creditAccount: '1101-交易性金融资产', amount: 380000, maker: '系统', makeTime: '2026-04-30 17:30' },
    { id: 'VCH20260425001', summary: '一创优享FOF3号赎回', debitAccount: '1002-银行存款', creditAccount: '1101-交易性金融资产', amount: 10000000, maker: '系统', makeTime: '2026-04-25 17:30' },
    { id: 'VCH20260517003', summary: '国君君得3640申购', debitAccount: '1101-交易性金融资产', creditAccount: '1002-银行存款', amount: 8000000, maker: '系统', makeTime: '2026-05-17 17:30' }
];

var CONTRACTS = [
    { id: 'CT20260310001', tradeId: 'TRX20260310001', productId: 'P001', productName: '天玑13号', counterpartyId: 'CP002', counterpartyName: '第一创业', manager: '', type: '专户资管合同', amount: 10000000, signDate: '2026-03-10', expireDate: '', initFile: '天玑13号合同_初始.pdf', sealFile: '天玑13号合同_用印版.pdf', version: '用印版本', status: '已推送', remark: '' },
    { id: 'CT20260310002', tradeId: 'TRX20260310001', productId: 'P001', productName: '天玑13号', counterpartyId: 'CP001', counterpartyName: '国泰君安', manager: '', type: '托管合同', amount: 10000000, signDate: '2026-03-12', expireDate: '', initFile: '天玑13号托管合同_初始.pdf', sealFile: '', version: '初始版本', status: '待上传用印', remark: '托管人合同' },
    { id: 'CT20260315001', tradeId: 'TRX20260315001', productId: 'P001', productName: '天玑13号', counterpartyId: 'CP002', counterpartyName: '第一创业', manager: '', type: '补充协议', amount: 5000000, signDate: '2026-03-15', expireDate: '', initFile: '天玑13号追加合同_初始.pdf', sealFile: '天玑13号追加合同_用印版.pdf', version: '用印版本', status: '待推送', remark: '追加投资' },
    { id: 'CT20260401001', tradeId: 'TRX20260401001', productId: 'P002', productName: '盛乾同行2号', counterpartyId: 'CP003', counterpartyName: '国金证券', manager: '', type: 'FOF投资合同', amount: 12000000, signDate: '2026-04-01', expireDate: '', initFile: '盛乾同行2号合同_初始.pdf', sealFile: '盛乾同行2号合同_用印版.pdf', version: '用印版本', status: '已签署', remark: '' },
    { id: 'CT20260510001', tradeId: 'TRX20260510001', productId: 'P005', productName: '中信财富3791号FOF', counterpartyId: 'CP005', counterpartyName: '中信资管', manager: '', type: 'FOF投资合同', amount: 5000000, signDate: '2026-05-10', expireDate: '', initFile: '中信财富3791号合同_初始.pdf', sealFile: '', version: '初始版本', status: '待上传用印', remark: '' },
    { id: 'CT20260505001', tradeId: 'TRX20260505001', productId: 'P010', productName: '易米元睿一号', counterpartyId: 'CP004', counterpartyName: '中金财富', manager: '易米基金', type: '权益投资合同', amount: 8000000, signDate: '2026-05-05', expireDate: '2027-12-31', initFile: '易米元睿一号合同_初始.pdf', sealFile: '易米元睿一号合同_用印版.pdf', version: '用印版本', status: '已推送', remark: '管理人为易米基金' }
];

var NAV_HISTORY = {
    'P001': [
        {date:'2026-05-17',nav:1.0234,accNav:1.1234,dailyReturn:0.12},
        {date:'2026-05-16',nav:1.0222,accNav:1.1222,dailyReturn:-0.05},
        {date:'2026-05-15',nav:1.0228,accNav:1.1228,dailyReturn:0.08},
        {date:'2026-05-14',nav:1.0220,accNav:1.1220,dailyReturn:0.03},
        {date:'2026-05-13',nav:1.0217,accNav:1.1217,dailyReturn:-0.02},
        {date:'2026-05-12',nav:1.0219,accNav:1.1219,dailyReturn:0.15},
        {date:'2026-05-11',nav:1.0204,accNav:1.1204,dailyReturn:0.06}
    ]
};

function formatMoney(n) {
    if (n >= 100000000) return (n / 100000000).toFixed(2) + '亿';
    if (n >= 10000) return (n / 10000).toFixed(0) + '万';
    return n.toLocaleString();
}

function formatMoneyFull(n) {
    return '¥' + n.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function getStatusClass(status) {
    var map = {
        '待提交': 'status-pending', '审批中': 'status-processing', '已通过': 'status-approved', '已完结': 'status-completed',
        '草稿': 'status-pending', '待审批': 'status-processing', '已驳回': 'status-rejected', '已终止': 'status-frozen',
        '待投': 'status-pending', '在投': 'status-investing', '无计划': 'status-pending', '完结': 'status-completed', '禁用': 'status-frozen', '已到期': 'status-rejected',
        '在池': 'status-approved', '待入池': 'status-pending',
        '待确认': 'status-pending', '已确认': 'status-confirmed', '已推送NC': 'status-pushed',
        '已成交': 'status-approved', '待执行': 'status-processing', '执行中': 'status-processing', '已撤回': 'status-frozen',
        '买入': 'status-investing', '买入(开仓)': 'status-investing', '赎回': 'status-rejected',
        '待上传用印': 'status-pending', '待推送': 'status-processing', '已推送': 'status-pushed', '已签署': 'status-approved',
        '初始版本': 'status-pending', '用印版本': 'status-confirmed'
    };
    return map[status] || 'status-pending';
}

function getChangeTypeClass(type) {
    var map = {'兑息兑付': 'type-dividend', '公允价值变更': 'type-fairvalue', '申购': 'type-plan-notice', '赎回': 'type-redeem', '内部往来': 'type-plan-notice'};
    return map[type] || 'type-plan-notice';
}

var NOTIFICATIONS = [
    { id: 'N001', type: 'NC推送失败', level: 'emergency', title: 'NC推送失败', content: '凭证VCH20260517003推送失败', object: 'VCH20260517003', page: 'finance.html', read: false, time: '2分钟前' },
    { id: 'N002', type: '净值异常', level: 'emergency', title: '净值解析失败', content: '天玑13号净值邮件解析失败', object: 'P001', page: 'product_detail.html?id=P001', read: false, time: '15分钟前' },
    { id: 'N003', type: 'iBor异常', level: 'warning', title: 'iBor拉取异常', content: '日终数据拉取失败，请检查', object: '', page: 'investment_manager.html', read: false, time: '1小时前' },
    { id: 'N004', type: '凭证超时', level: 'warning', title: '凭证待审核超时', content: 'VCH20260517001待审核超4小时', object: 'VCH20260517001', page: 'finance.html', read: false, time: '4小时前' },
    { id: 'N005', type: '审批通知', level: 'normal', title: '新审批事项', content: '投资计划书ABS专项投资计划待审批', object: 'TP20260515001', page: 'approval.html', read: false, time: '1小时前' },
    { id: 'N006', type: '审批结果', level: 'normal', title: '审批已处理', content: '盛乾同行2号投资计划已通过', object: 'TP20260305001', page: 'approval.html', read: true, time: '昨天' },
    { id: 'N007', type: '到期预警', level: 'warning', title: '产品到期预警', content: '国君君得3640将于2027-06-30到期', object: 'P004', page: 'product_detail.html?id=P004', read: true, time: '昨天' },
    { id: 'N008', type: '流程完成', level: 'normal', title: '流程完成', content: '天玑13号投资计划已完结', object: 'TP20260301001', page: 'trade.html', read: true, time: '2天前' }
];

function getNotifications() {
    return NOTIFICATIONS;
}

function getUnreadCount() {
    return NOTIFICATIONS.filter(function(n) { return !n.read; }).length;
}

var navConfig = MENU_CONFIG;

document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    var role = document.getElementById('role').value;
    if (!role) { alert('请选择身份'); return; }
    var pwd = document.getElementById('password').value;
    if (!pwd) { alert('请输入登录密码'); return; }
    if (pwd !== 'oms') { alert('密码错误，请重新输入'); document.getElementById('password').value = ''; return; }
    sessionStorage.setItem('oms_role', role);
    var landing = {
        investment_manager: 'investment_manager.html',
        trader: 'trade.html',
        risk_control: 'approval.html',
        department_leader: 'approval.html',
        financial_staff: 'finance.html',
        company_leader: 'investment_manager.html',
        admin: 'user.html',
        demo: 'investment_manager.html'
    };
    window.location.href = landing[role] || 'investment_manager.html';
});

function buildSidebar(activeHref) {
    var roleKey = getCurrentRoleKey();
    var html = '<div class="sidebar-brand"><div class="brand-icon">O</div><div class="brand-text">OMS系统</div></div>';
    html += '<div class="sidebar-nav">';
    MENU_CONFIG.forEach(function(item) {
        if (item.roles.indexOf(roleKey) === -1) return;
        var cls = item.href === activeHref ? ' active' : '';
        html += '<a href="' + item.href + '" class="nav-item' + cls + '"><span class="nav-icon">' + item.icon + '</span><span class="nav-label">' + item.label + '</span></a>';
    });
    html += '</div>';
    html += '<div class="sidebar-footer"><a href="login.html" class="nav-item"><span class="nav-icon">🚪</span><span class="nav-label">退出登录</span></a></div>';
    return html;
}

function buildTopbar(breadcrumb, userName) {
    userName = userName || getCurrentRole().label;
    var notifications = getNotifications();
    var unread = getUnreadCount();
    var html = '<div class="topbar-breadcrumb"><span>' + breadcrumb + '</span></div>';
    html += '<div class="topbar-spacer"></div>';
    html += '<div class="topbar-right">';
    html += '<div class="topbar-time" id="currentTime"></div>';
    html += '<div class="notification-wrapper" onclick="toggleNotification(event)">';
    html += '<span class="notification-icon">🔔' + (unread > 0 ? '<span class="notification-badge">' + unread + '</span>' : '') + '</span>';
    html += '<div class="notification-dropdown" id="notifDropdown">';
    html += '<div class="notification-dropdown-header">通知中心<span style="float:right;cursor:pointer;color:var(--primary);font-size:11px;" onclick="markAllRead(event)">全部已读</span></div>';
    html += '<div class="notif-filter-bar" style="padding:6px 12px;display:flex;gap:6px;border-bottom:1px solid var(--border-light);">';
    html += '<span class="notif-filter-tag active" onclick="filterNotifs(event,\'all\')" style="cursor:pointer;font-size:11px;padding:2px 6px;border-radius:3px;">全部</span>';
    html += '<span class="notif-filter-tag" onclick="filterNotifs(event,\'emergency\')" style="cursor:pointer;font-size:11px;padding:2px 6px;border-radius:3px;">🔴紧急</span>';
    html += '<span class="notif-filter-tag" onclick="filterNotifs(event,\'warning\')" style="cursor:pointer;font-size:11px;padding:2px 6px;border-radius:3px;">🟡警告</span>';
    html += '<span class="notif-filter-tag" onclick="filterNotifs(event,\'normal\')" style="cursor:pointer;font-size:11px;padding:2px 6px;border-radius:3px;">🟢正常</span>';
    html += '</div>';
    notifications.slice(0, 20).forEach(function(n) {
        var bg = n.read ? '' : 'background:var(--info-bg);';
        var fw = n.read ? '' : 'font-weight:600;';
        var icon = n.level === 'emergency' ? '🔴' : n.level === 'warning' ? '🟡' : '🟢';
        html += '<div class="notification-item" data-level="' + n.level + '" style="' + bg + fw + '" onclick="location.href=\'' + n.page + '\'">';
        html += '<div class="noti-type">' + icon + ' ' + n.title + ' <span style="color:var(--text-muted);float:right;font-weight:normal;">' + n.time + '</span></div>';
        html += '<div class="noti-text">' + n.content + '</div>';
        html += '</div>';
    });
    html += '<div class="notification-footer"><a href="profile.html#notification">查看全部 →</a></div>';
    html += '</div></div>';
    html += '<a href="profile.html" class="topbar-user" title="个人中心"><div class="user-avatar">' + userName.charAt(0) + '</div><span>' + userName + '</span></a>';
    html += '<a href="login.html" class="logout-btn">退出</a>';
    html += '</div>';
    return html;
}

function initLayout(activeHref, breadcrumb, userName) {
    var appLayout = document.querySelector('.app-layout');
    if (!appLayout) return;
    var sidebar = appLayout.querySelector('.sidebar');
    var topbar = appLayout.querySelector('.topbar');
    if (sidebar) sidebar.innerHTML = buildSidebar(activeHref);
    if (topbar) topbar.innerHTML = buildTopbar(breadcrumb, userName);
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    var now = new Date();
    var str = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0') + ':' + String(now.getSeconds()).padStart(2,'0');
    var el = document.getElementById('currentTime');
    if (el) el.textContent = str;
}

function initNotification() {
    document.addEventListener('click', function(event) {
        var dd = document.getElementById('notifDropdown');
        if (dd && !dd.contains(event.target) && !event.target.closest('.notification-wrapper')) {
            dd.classList.remove('show');
        }
    });
}

function toggleNotification(event) {
    event.stopPropagation();
    var dd = document.getElementById('notifDropdown');
    if (dd) dd.classList.toggle('show');
}

function markAllRead(event) {
    event.stopPropagation();
    NOTIFICATIONS.forEach(function(n) { n.read = true; });
    var badge = document.querySelector('.notification-badge');
    if (badge) badge.style.display = 'none';
    var dropdown = document.getElementById('notifDropdown');
    if (dropdown) {
        dropdown.querySelectorAll('.notification-item').forEach(function(el) {
            el.style.background = '';
            el.style.fontWeight = '';
        });
    }
}

function filterNotifs(event, level) {
    event.stopPropagation();
    document.querySelectorAll('.notif-filter-tag').forEach(function(t) { t.classList.remove('active'); });
    event.target.classList.add('active');
    document.querySelectorAll('#notifDropdown .notification-item').forEach(function(el) {
        var lv = el.getAttribute('data-level');
        el.style.display = (level === 'all' || lv === level) ? '' : 'none';
    });
}

window.addEventListener('DOMContentLoaded', function() {
    initNotification();
});
