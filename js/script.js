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
    { href: 'product.html', icon: '📦', label: '产品管理', roles: ['investment_manager','trader','risk_control','department_leader','company_leader','admin','demo'] },
    { href: 'trade.html', icon: '💹', label: '投资管理', roles: ['investment_manager','trader','risk_control','department_leader','company_leader','admin','demo'], children: [
        { href: 'trade.html', label: '计划书管理' },
        { href: 'trade_list.html', label: '交易管理' }
    ]},
    { href: 'approval.html', icon: '✅', label: '审批中心', roles: ['investment_manager','trader','risk_control','department_leader','financial_staff','company_leader','admin','demo'] },
    { href: 'finance.html', icon: '💰', label: '财务核算', roles: ['financial_staff','company_leader','admin','demo'] },
    { href: 'user.html', icon: '👤', label: '权限管理', roles: ['admin','demo'] },
    { href: 'system.html', icon: '⚙', label: '系统管理', roles: ['admin','demo'] }
];

// ===== PRD（五）830问题优化-1：账套类型细化（树形结构：大类 → E列账户名称） =====
var ACCOUNT_TREE = {
    '结构化': ['XIR_创新金融部_中保登', 'XIR_创新金融部_非标'],
    '专户': ['XIR_创新金融部专户(固收类)', 'XIR_创新金融部FOF组合2', 'XIR_创新金融部FOF组合1'],
    '信托计划': ['XIR_创新金融部信托计划'],
    '碳金融': ['XIR_创新金融部碳金融']
};
// E列账户名称 → 账套大类（入池表单内部逻辑：产品类型/资产类型/专属字段联动仍按大类）
var ACCOUNT_CATEGORY_MAP = {
    'XIR_创新金融部_中保登': '结构化（保交所）',
    'XIR_创新金融部_非标': '结构化（保交所）',
    'XIR_创新金融部专户(固收类)': '专户（资管计划）',
    'XIR_创新金融部FOF组合2': '专户（资管计划）',
    'XIR_创新金融部FOF组合1': '专户（资管计划）',
    'XIR_创新金融部信托计划': '信托计划',
    'XIR_创新金融部碳金融': '碳金融'
};
// ===== PRD（五）830问题优化-2：投资组合ID映射（交易的投资组合字段无需用户填写，传输iBor时按产品账套自动转换） =====
var PORTFOLIO_ID_MAP = {
    'XIR_创新金融部_中保登': 'XIR_cxjrb_zbd_secu',
    'XIR_创新金融部_非标': 'XIR_cxjrb_fb_secu',
    'XIR_创新金融部专户(固收类)': 'XIR_cxjrb_gszh',
    'XIR_创新金融部FOF组合2': 'XIR_cxjrb_fof2',
    'XIR_创新金融部FOF组合1': 'XIR_cxjrb_fof1',
    'XIR_创新金融部信托计划': 'XIR_cxjrb_xtjh',
    'XIR_创新金融部碳金融': 'XIR_cxjrb_tjr'
};
function getAccountCategory(accountName) { return ACCOUNT_CATEGORY_MAP[accountName] || accountName; }
function getPortfolioId(accountName) { return PORTFOLIO_ID_MAP[accountName] || ''; }

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
    { id: 'P001', name: '演示-在投-专户', shortName: '演示-在投-专户', assetType: '专户资管产品', productType: '混合型', accountType: 'XIR_创新金融部专户(固收类)', hengtaiCode: 'XT20260301001', externalCode: '', dept: '创新金融业务总部', group: '专户投资组', expireDate: '', redeemable: true, status: '在投', nav: 1.0234, navDate: '2026-05-17', holdAmount: 15000000, holdShares: 14654321, planAmount: 20000000, usedAmount: 15000000, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2026-03-01', description: '场景：在投+专户+计划已通过', tradeMarket: '场外市场', currency: 'CNY', establishDate: '2026-01-15', manager: '中信证券资产管理有限公司', remark: '' },
    { id: 'P002', name: '演示-在投-信托', shortName: '演示-在投-信托', assetType: '信托', productType: '固收类', accountType: 'XIR_创新金融部信托计划', hengtaiCode: 'XT20260420001', externalCode: '', dept: 'FICC固定收益业务总部', group: '理财投资组', expireDate: '2028-04-20', redeemable: true, status: '在投', nav: 1.0300, navDate: '2026-05-17', holdAmount: 6000000, holdShares: 5825242, planAmount: 8000000, usedAmount: 6000000, counterparty: 'CP007', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2026-04-20', description: '场景：在投+信托+计划已通过', tradeMarket: 'IB 银行间', currency: 'CNY', establishDate: '2026-04-20', startDate: '2026-04-20', faceValue: 100, totalScale: 50000000, financier: '盐城城投集团有限公司', manager: '华泰证券资产管理有限公司', guarantor: '江苏省信用再担保集团', remark: '' },
    { id: 'P003', name: '演示-在投-ABS', shortName: '演示-在投-ABS', assetType: 'ABS(中保登)', productType: '固收类', accountType: 'XIR_创新金融部_中保登', hengtaiCode: 'ABS20260519001', externalCode: '1101010901', dept: '创新金融业务总部', group: 'fb账户', expireDate: '2027-06-30', redeemable: true, status: '在投', nav: 1.0512, navDate: '2026-05-17', holdAmount: 8000000, holdShares: 7610290, planAmount: 10000000, usedAmount: 8000000, counterparty: 'CP001', tradeLimit: 5000000, accountMapping: '{"debit":"1101-交易性金融资产","credit":"1002-银行存款"}', poolUser: '刘伟', poolTime: '2025-09-10', description: '场景：在投+ABS中保登', tradeMarket: '中保登', currency: 'CNY', establishDate: '2025-09-10', startDate: '2025-09-10', actualMaturityDate: '2027-06-30', faceValue: 100, totalScale: 80000000, concentration: '12.5%', creditRating: 'AAA', originator: '远东国际融资租赁有限公司', underlyingAssetType: '融资租赁债权', trancheLevel: '优先', annualYield: 3.85, remark: '' },
    { id: 'P004', name: '演示-在投-碳金融', shortName: '演示-在投-碳金融', assetType: '碳金融业务', productType: '固收类', accountType: 'XIR_创新金融部碳金融', hengtaiCode: 'CF20260315001', externalCode: '', dept: '创新金融业务总部', group: 'fb账户', expireDate: '2027-03-15', redeemable: true, status: '在投', nav: 1.0000, navDate: '2026-05-20', holdAmount: 5000000, holdShares: 5000, planAmount: 8000000, usedAmount: 5000000, counterparty: 'CP006', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2026-03-15', description: '场景：在投+碳金融', currency: 'CNY', regionalMarket: 'IB 银行间', counterpartyIbor: '上海环境能源交易所', annualYield: 4.2, remark: '' },
    { id: 'P005', name: '演示-无计划-专户', shortName: '演示-无计划-专户', assetType: '专户资管产品', productType: 'FOF', accountType: 'XIR_创新金融部FOF组合1', hengtaiCode: 'XT20250910002', externalCode: '', dept: '创新金融业务总部', group: 'xn账户', expireDate: '', redeemable: true, status: '无计划', nav: 1.0156, navDate: '2026-05-16', holdAmount: 0, holdShares: 0, planAmount: 0, usedAmount: 0, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2025-09-10', description: '场景：无计划+可发起新计划', tradeMarket: 'FOF', currency: 'CNY', establishDate: '2025-09-10', manager: '国泰君安证券股份有限公司', remark: '' },
    { id: 'P006', name: '演示-草稿-专户', shortName: '演示-草稿-专户', assetType: '专户资管产品', productType: '固收类', accountType: 'XIR_创新金融部专户(固收类)', hengtaiCode: 'XT20251105001', externalCode: '', dept: '创新金融业务总部', group: '专户投资组', expireDate: '', redeemable: true, status: '草稿', nav: 1.0000, navDate: '', holdAmount: 0, holdShares: 0, planAmount: 0, usedAmount: 0, counterparty: '', tradeLimit: 0, accountMapping: '', poolUser: '刘伟', poolTime: '2025-11-05', description: '场景：入池信息草稿' }
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
    { id: 'TP20260301001', name: '2026年Q1演示-在投-专户投资计划', dept: '创新金融业务总部', group: '专户投资组', trader: '李华', totalAmount: 20000000, usedAmount: 15000000, status: '已通过', creator: '张明', createTime: '2026-03-01 09:30', submitTime: '2026-03-01 09:30', file: '演示-在投-专户投资计划书.docx', products: ['P001'], productDetails: [{ id: 'P001', amount: 20000000, direction: '申购', operationMode: '开放式', investMode: '直销', holdPeriod: '1年' }], remark: '场景：已通过+可发起交易' },
    { id: 'TP20260425001', name: '2026年4月信托固收投资计划', dept: 'FICC固定收益业务总部', group: '理财投资组', trader: '赵丽', totalAmount: 8000000, usedAmount: 6000000, status: '已通过', creator: '王强', createTime: '2026-04-25 11:00', submitTime: '2026-04-25 11:00', file: '信托固收投资计划书.docx', products: ['P002'], productDetails: [{ id: 'P002', amount: 8000000, direction: '申购', operationMode: '开放式', investMode: '代销', holdPeriod: '6个月' }], remark: '场景：已通过+信托产品' },
    { id: 'TP20260515001', name: '2026年5月ABS专项投资计划', dept: '创新金融业务总部', group: 'fb账户', trader: '李华', totalAmount: 10000000, usedAmount: 8000000, status: '待审批', creator: '张明', createTime: '2026-05-15 09:30', submitTime: '2026-05-15 09:30', file: 'ABS专项投资计划书.docx', products: ['P003'], productDetails: [{ id: 'P003', amount: 10000000, direction: '申购', operationMode: '封闭式', investMode: '直销', holdPeriod: '2年' }], remark: '场景：待审批' },
    { id: 'TP20260518001', name: '2026年5月FICC固收投资计划', dept: 'FICC固定收益业务总部', group: '理财投资组', trader: '赵丽', totalAmount: 25000000, usedAmount: 0, status: '已驳回', creator: '王强', createTime: '2026-05-18 10:00', submitTime: '', file: 'FICC固收投资计划书.pdf', products: ['P002'], productDetails: [{ id: 'P002', amount: 25000000, direction: '申购', operationMode: '开放式', investMode: '直销', holdPeriod: '1年' }], remark: '场景：已驳回' },
    { id: 'TP20260520001', name: '2026年5月碳金融投资计划', dept: '创新金融业务总部', group: 'fb账户', trader: '李华', totalAmount: 5000000, usedAmount: 0, status: '已终止', creator: '张明', createTime: '2026-05-20 10:00', submitTime: '2026-05-20 10:00', file: '碳金融投资计划书.docx', products: ['P004'], productDetails: [{ id: 'P004', amount: 5000000, direction: '申购', operationMode: '开放式', investMode: '直销', holdPeriod: '3个月' }], remark: '场景：已终止' },
    { id: 'TP20260601001', name: '2026年6月新计划草稿', dept: '创新金融业务总部', group: '专户投资组', trader: '李华', totalAmount: 5000000, usedAmount: 0, status: '草稿', creator: '张明', createTime: '2026-06-01 09:00', submitTime: '', file: '新计划草稿.docx', products: ['P005'], productDetails: [{ id: 'P005', amount: 5000000, direction: '申购', operationMode: '开放式', investMode: '代销', holdPeriod: '6个月' }], remark: '场景：草稿未提交' },
    // 演示用：全部字段已预填，列表直接点"提交审批"即可进入风控审批节点（demo账号可连续点通过走完流程）
    { id: 'TP20260911001', name: '2026年演示-预填完整投资计划', dept: '创新金融业务总部', group: 'fb账户', trader: '李华', totalAmount: 3000000, usedAmount: 0, status: '草稿', creator: '张明', createTime: '2026-09-11 09:00', submitTime: '', file: '2026年演示-预填完整投资计划书.docx', products: ['P004'], productDetails: [{ id: 'P004', amount: 3000000, direction: '申购', operationMode: '开放式', investMode: '直销', holdPeriod: '6个月' }], remark: '演示用：全部字段已预填，直接点提交审批' }
];

var TRADES = [
    // 买入-已结束：全流程完成（三级审批→ERP用款→成交确认→凭证推送）
    { id: 'TRX20260310001', planId: 'TP20260301001', productId: 'P001', productName: '演示-在投-专户', type: '买入', applyAmount: 10000000, shares: '', expectedDate: '', dealAmount: 10000000, status: '已结束', trader: '李华', createTime: '2026-03-10 14:00', remark: '', counterpartyId: 'CP002', counterpartyName: '第一创业', priority: '优先级', assetType: '专户资管产品', erpStep1Status: '已完成', erpStep1Type: '资金划拨(用款)', erpStep1Time: '2026-03-10 15:00', erpStep2Status: '已完成', erpStep2Type: '创新金融-资金划拨申请', erpStep2Time: '2026-03-10 16:00', traderConfirmStatus: '已确认', actualDealAmount: 10000000, traderConfirmTime: '2026-03-10 17:00', voucherStatus: '已推送' },
    // 买入-交易审批中：三级审批中（当前节点：风控审批）
    { id: 'TRX20260516001', planId: 'TP20260425001', productId: 'P002', productName: '演示-在投-信托', type: '买入', applyAmount: 1000000, shares: '', expectedDate: '', dealAmount: 0, status: '交易审批中', trader: '李华', createTime: '2026-05-16 14:00', remark: '信托加仓，三级审批中（当前节点：风控审批）', counterpartyId: 'CP007', counterpartyName: '华泰资管', priority: '优先级', assetType: '信托', erpStep1Status: '待执行', erpStep1Type: '资金划拨(用款)', erpStep1Time: '', erpStep2Status: '待执行', erpStep2Type: '创新金融-资金划拨申请', erpStep2Time: '', traderConfirmStatus: '待确认', actualDealAmount: 0, traderConfirmTime: '', voucherStatus: '待生成' },
    // 买入-交易执行中：ERP已完成，待交易员确认成交
    { id: 'TRX20260523001', planId: 'TP20260301001', productId: 'P001', productName: '演示-在投-专户', type: '买入', applyAmount: 3000000, shares: '', expectedDate: '', dealAmount: 0, status: '交易执行中', trader: '李华', createTime: '2026-05-23 09:00', remark: 'ERP已完成，待交易员确认成交', counterpartyId: 'CP002', counterpartyName: '第一创业', priority: '优先级', assetType: '专户资管产品', erpStep1Status: '已完成', erpStep1Type: '资金划拨(用款)', erpStep1Time: '2026-05-23 10:00', erpStep2Status: '已完成', erpStep2Type: '创新金融-资金划拨申请', erpStep2Time: '2026-05-23 11:00', traderConfirmStatus: '待确认', actualDealAmount: 0, traderConfirmTime: '', voucherStatus: '待生成' },
    // 买入-未提交（草稿）
    { id: 'TRX20260524001', planId: 'TP20260301001', productId: 'P001', productName: '演示-在投-专户', type: '买入', applyAmount: 1000000, shares: '', expectedDate: '', dealAmount: 0, status: '未提交', trader: '李华', createTime: '2026-05-24 16:30', remark: '草稿待完善', counterpartyId: 'CP002', counterpartyName: '第一创业', priority: '', assetType: '专户资管产品', erpStep1Status: '待执行', erpStep1Type: '资金划拨(用款)', erpStep1Time: '', erpStep2Status: '待执行', erpStep2Type: '创新金融-资金划拨申请', erpStep2Time: '', traderConfirmStatus: '待确认', actualDealAmount: 0, traderConfirmTime: '', voucherStatus: '待生成' },
    // 买入-已驳回（风控驳回：申报金额超投资计划剩余额度）
    { id: 'TRX20260514001', planId: 'TP20260301001', productId: 'P001', productName: '演示-在投-专户', type: '买入', applyAmount: 8000000, shares: '', expectedDate: '', dealAmount: 0, status: '已驳回', trader: '李华', createTime: '2026-05-14 15:00', remark: '风控驳回：申报金额超投资计划剩余额度', counterpartyId: 'CP002', counterpartyName: '第一创业', priority: '', assetType: '专户资管产品', erpStep1Status: '待执行', erpStep1Type: '资金划拨(用款)', erpStep1Time: '', erpStep2Status: '待执行', erpStep2Type: '创新金融-资金划拨申请', erpStep2Time: '', traderConfirmStatus: '待确认', actualDealAmount: 0, traderConfirmTime: '', voucherStatus: '待生成' },
    // 买入-已撤回（发起人撤回）
    { id: 'TRX20260512001', planId: 'TP20260425001', productId: 'P002', productName: '演示-在投-信托', type: '买入', applyAmount: 500000, shares: '', expectedDate: '', dealAmount: 0, status: '已撤回', trader: '李华', createTime: '2026-05-12 11:00', remark: '市场波动撤回', counterpartyId: 'CP007', counterpartyName: '华泰资管', priority: '', assetType: '信托', erpStep1Status: '待执行', erpStep1Type: '资金划拨(用款)', erpStep1Time: '', erpStep2Status: '待执行', erpStep2Type: '创新金融-资金划拨申请', erpStep2Time: '', traderConfirmStatus: '待确认', actualDealAmount: 0, traderConfirmTime: '', voucherStatus: '待生成' },
    // 赎回-交易执行中：三级审批已通过，待财务对账确认（填写对账表单即代表交易执行成功）
    { id: 'TRX20260527001', planId: 'TP20260301001', productId: 'P001', productName: '演示-在投-专户', type: '赎回', applyAmount: 2500000, shares: '2500000', expectedDate: '2026-06-01', dealAmount: 0, status: '交易执行中', trader: '李华', createTime: '2026-05-27 14:00', remark: '三级审批已通过，待财务对账确认（交易执行中）', counterpartyId: 'CP002', counterpartyName: '第一创业', priority: '', assetType: '专户资管产品', erpStep1Status: '不适用', erpStep1Type: '', erpStep1Time: '', erpStep2Status: '不适用', erpStep2Type: '', erpStep2Time: '', traderConfirmStatus: '待确认', actualDealAmount: 0, traderConfirmTime: '', voucherStatus: '待生成', financeConfirmStatus: '待确认', financeConfirmUser: '', financeConfirmTime: '', statementFile: '', actualArrivalAmount: 0, actualArrivalShares: 0, actualArrivalDate: '', redeemFee: 0, diffRemark: '', traderSupplementStatus: '待补充', traderSupplementTime: '', supplementFile: '', supplementRemark: '', actualNav: 0 },
    // 赎回-待交易员补充信息：财务对账确认已完成
    { id: 'TRX20260601001', planId: 'TP20260425001', productId: 'P002', productName: '演示-在投-信托', type: '赎回', applyAmount: 3000000, shares: '3000000', expectedDate: '2026-06-03', dealAmount: 0, status: '待交易员补充信息', trader: '李华', createTime: '2026-06-01 09:30', remark: '财务已确认对账（实际到账2,962,800元），待交易员补充信息', counterpartyId: 'CP007', counterpartyName: '华泰资管', priority: '', assetType: '信托', erpStep1Status: '不适用', erpStep1Type: '', erpStep1Time: '', erpStep2Status: '不适用', erpStep2Type: '', erpStep2Time: '', traderConfirmStatus: '待确认', actualDealAmount: 0, traderConfirmTime: '', voucherStatus: '待生成', financeConfirmStatus: '已确认', financeConfirmUser: '赵静', financeConfirmTime: '2026-06-03 15:00', statementFile: '银行回单_赎回到账_2962800.pdf', actualArrivalAmount: 2962800, actualArrivalShares: 3000000, actualArrivalDate: '2026-06-03', redeemFee: 0, diffRemark: '实际到账按净值0.9876折算，与申请金额差异37,200元', traderSupplementStatus: '待补充', traderSupplementTime: '', supplementFile: '', supplementRemark: '', actualNav: 0 },
    // 赎回-已结束：交易员补充信息确认后流程结束（持仓核销、凭证已生成）
    { id: 'TRX20260602001', planId: 'TP20260425001', productId: 'P002', productName: '演示-在投-信托', type: '赎回', applyAmount: 2000000, shares: '2000000', expectedDate: '2026-06-05', dealAmount: 1975200, status: '已结束', trader: '李华', createTime: '2026-06-02 10:00', remark: '交易员补充信息确认完成，流程结束', counterpartyId: 'CP007', counterpartyName: '华泰资管', priority: '', assetType: '信托', erpStep1Status: '不适用', erpStep1Type: '', erpStep1Time: '', erpStep2Status: '不适用', erpStep2Type: '', erpStep2Time: '', traderConfirmStatus: '已确认', actualDealAmount: 1975200, traderConfirmTime: '2026-06-05 11:00', voucherStatus: '已生成', financeConfirmStatus: '已确认', financeConfirmUser: '赵静', financeConfirmTime: '2026-06-05 09:40', statementFile: '银行回单_赎回到账_1975200.pdf', actualArrivalAmount: 1975200, actualArrivalShares: 2000000, actualArrivalDate: '2026-06-05', redeemFee: 0, diffRemark: '按净值0.9876折算', traderSupplementStatus: '已补充', traderSupplementTime: '2026-06-05 11:00', supplementFile: '赎回确认单_20260605.pdf', supplementRemark: '净值0.9876确认无误', actualNav: 0.9876 },
    // 赎回-已终止：发起人主动终止
    { id: 'TRX20260521001', planId: 'TP20260301001', productId: 'P001', productName: '演示-在投-专户', type: '赎回', applyAmount: 2000000, shares: '2000000', expectedDate: '', dealAmount: 0, status: '已终止', trader: '李华', createTime: '2026-05-21 09:30', remark: '发起人主动终止', counterpartyId: 'CP002', counterpartyName: '第一创业', priority: '', assetType: '专户资管产品', erpStep1Status: '不适用', erpStep1Type: '', erpStep1Time: '', erpStep2Status: '不适用', erpStep2Type: '', erpStep2Time: '', traderConfirmStatus: '待确认', actualDealAmount: 0, traderConfirmTime: '', voucherStatus: '待生成', financeConfirmStatus: '待确认', financeConfirmUser: '', financeConfirmTime: '', statementFile: '', actualArrivalAmount: 0, actualArrivalShares: 0, actualArrivalDate: '', redeemFee: 0, diffRemark: '', traderSupplementStatus: '待补充', traderSupplementTime: '', supplementFile: '', supplementRemark: '', actualNav: 0 },
    // 演示用：申购草稿，全部字段已预填（金额100万=价格1.0234×数量977135.04），详情直接点"提交审批"进入投资经理审批
    { id: 'TRX20260911001', planId: 'TP20260301001', productId: 'P001', productName: '演示-在投-专户', type: '买入', applyAmount: 1000000, shares: '977135.04', price: '1.0234', expectedDate: '2026-09-18', dealAmount: 0, status: '未提交', trader: '李华', createTime: '2026-09-11 09:30', remark: '演示用：全部字段已预填，直接点提交审批', counterpartyId: '', counterpartyName: '', priority: '优先级', cpCnaps: '123456789012', assetType: '专户资管产品', erpStep1Status: '待执行', erpStep1Type: '资金划拨(用款)', erpStep1Time: '', erpStep2Status: '待执行', erpStep2Type: '创新金融-资金划拨申请', erpStep2Time: '', traderConfirmStatus: '待确认', actualDealAmount: 0, traderConfirmTime: '', voucherStatus: '待生成' },
    // 演示用：赎回草稿，全部字段已预填（金额103万=净值1.0300×份额100万，是否清盘=否），详情直接点"提交审批"进入投资经理审批
    { id: 'TRX20260911002', planId: 'TP20260425001', productId: 'P002', productName: '演示-在投-信托', type: '赎回', applyAmount: 1030000, shares: '1000000', price: '1.0300', expectedDate: '2026-09-18', dealAmount: 0, status: '未提交', trader: '李华', createTime: '2026-09-11 09:35', remark: '演示用：全部字段已预填，直接点提交审批', counterpartyId: 'CP007', counterpartyName: '华泰资管', priority: '', isClearing: '否', cpCnaps: '987654321098', assetType: '信托', erpStep1Status: '不适用', erpStep1Type: '', erpStep1Time: '', erpStep2Status: '不适用', erpStep2Type: '', erpStep2Time: '', traderConfirmStatus: '待确认', actualDealAmount: 0, traderConfirmTime: '', voucherStatus: '待生成', financeConfirmStatus: '待确认', financeConfirmUser: '', financeConfirmTime: '', statementFile: '', actualArrivalAmount: 0, actualArrivalShares: 0, actualArrivalDate: '', redeemFee: 0, diffRemark: '', traderSupplementStatus: '待补充', traderSupplementTime: '', supplementFile: '', supplementRemark: '', actualNav: 0 }
];

var APPROVALS = [
    // ===== 投资计划书审批（每个计划书一条，覆盖 审批中/已通过/已驳回/已终止/草稿） =====
    { id: 'APR20260515001', type: '投资计划书审批', object: 'TP20260515001', objectName: '2026年5月ABS专项投资计划', applicant: '张明', applyTime: '2026-05-15 09:30', status: '审批中', steps: [{title: '投资经理提交', user: '张明', time: '2026-05-15 09:30', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '', status: '当前'}, {title: '部门负责人审批', user: '孙磊', time: '', status: '待处理'}] },
    { id: 'APR20260301001', type: '投资计划书审批', object: 'TP20260301001', objectName: '2026年Q1演示-在投-专户投资计划', applicant: '张明', applyTime: '2026-03-01 09:30', status: '已通过', steps: [{title: '投资经理提交', user: '张明', time: '2026-03-01 09:30', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-03-01 14:20', status: '已完成'}, {title: '部门负责人审批', user: '孙磊', time: '2026-03-02 10:00', status: '已完成'}] },
    { id: 'APR20260425001', type: '投资计划书审批', object: 'TP20260425001', objectName: '2026年4月信托固收投资计划', applicant: '王强', applyTime: '2026-04-25 11:00', status: '已通过', steps: [{title: '投资经理提交', user: '王强', time: '2026-04-25 11:00', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-04-25 15:00', status: '已完成'}, {title: '部门负责人审批', user: '孙磊', time: '2026-04-26 10:00', status: '已完成'}] },
    { id: 'APR20260518001', type: '投资计划书审批', object: 'TP20260518001', objectName: '2026年5月FICC固收投资计划', applicant: '王强', applyTime: '2026-05-18 10:00', status: '已驳回', steps: [{title: '投资经理提交', user: '王强', time: '2026-05-18 10:00', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-05-18 14:30', status: '已完成', result: '驳回', reason: '固收产品集中度过高，建议分散投资'}, {title: '部门负责人审批', user: '孙磊', time: '', status: '待处理'}] },
    { id: 'APR20260520001', type: '投资计划书审批', object: 'TP20260520001', objectName: '2026年5月碳金融投资计划', applicant: '张明', applyTime: '2026-05-20 10:00', status: '已终止', steps: [{title: '投资经理提交', user: '张明', time: '2026-05-20 10:00', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '', status: '待处理'}, {title: '部门负责人审批', user: '孙磊', time: '', status: '待处理'}] },
    { id: 'APR20260601001', type: '投资计划书审批', object: 'TP20260601001', objectName: '2026年6月新计划草稿', applicant: '张明', applyTime: '', status: '草稿', steps: [{title: '投资经理提交', user: '张明', time: '', status: '待处理'}, {title: '风控审批', user: '刘伟', time: '', status: '待处理'}, {title: '部门负责人审批', user: '孙磊', time: '', status: '待处理'}] },
    { id: 'APR20260911001', type: '投资计划书审批', object: 'TP20260911001', objectName: '2026年演示-预填完整投资计划', applicant: '张明', applyTime: '', status: '草稿', steps: [{title: '投资经理提交', user: '张明', time: '', status: '待处理'}, {title: '风控审批', user: '刘伟', time: '', status: '待处理'}, {title: '部门负责人审批', user: '孙磊', time: '', status: '待处理'}] },
    // ===== 产品入池审批（一条已通过、一条审批中） =====
    { id: 'APR20260519001', type: '产品入池审批', object: 'P003', objectName: '演示-在投-ABS', applicant: '刘伟', applyTime: '2026-05-19 09:00', status: '已通过', steps: [{title: '风控提交', user: '刘伟', time: '2026-05-19 09:00', status: '已完成'}, {title: '入池生效', user: '系统', time: '2026-05-19 09:05', status: '已完成'}] },
    { id: 'APR20260521002', type: '产品入池审批', object: 'P005', objectName: '演示-无计划-专户', applicant: '刘伟', applyTime: '2026-05-21 10:00', status: '审批中', steps: [{title: '风控提交', user: '刘伟', time: '2026-05-21 10:00', status: '已完成'}, {title: '入池生效', user: '系统', time: '', status: '当前'}] },
    // ===== 交易审批（与交易列表一一对应，草稿交易无审批记录） =====
    // 买入-已通过（全流程8节点完成）
    { id: 'APR20260310001', type: '交易审批', object: 'TRX20260310001', objectName: '演示-在投-专户-买入', applicant: '李华', applyTime: '2026-03-10 14:00', status: '已通过', steps: [{title: '交易员发起', user: '李华', time: '2026-03-10 14:00', status: '已完成'}, {title: '投资经理审批', user: '张明', time: '2026-03-10 14:20', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-03-10 14:40', status: '已完成'}, {title: '部门经理审批', user: '孙磊', time: '2026-03-10 14:55', status: '已完成'}, {title: 'ERP流程-资金划拨（用款）', user: '系统', time: '2026-03-10 15:00', status: '已完成'}, {title: 'ERP流程-创新金融（资金划拨申请）', user: '系统', time: '2026-03-10 16:00', status: '已完成'}, {title: '交易员确认（金额修正+合同上传）', user: '李华', time: '2026-03-10 17:00', status: '已完成'}, {title: '流程结束', user: '系统', time: '2026-03-10 17:00', status: '已完成'}] },
    // 买入-审批中（当前节点：风控审批）
    { id: 'APR20260516001', type: '交易审批', object: 'TRX20260516001', objectName: '演示-在投-信托-买入', applicant: '李华', applyTime: '2026-05-16 14:00', status: '审批中', steps: [{title: '交易员发起', user: '李华', time: '2026-05-16 14:00', status: '已完成'}, {title: '投资经理审批', user: '张明', time: '2026-05-16 15:00', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '', status: '当前'}, {title: '部门经理审批', user: '孙磊', time: '', status: '待处理'}, {title: 'ERP流程-资金划拨（用款）', user: '系统', time: '', status: '待处理'}, {title: 'ERP流程-创新金融（资金划拨申请）', user: '系统', time: '', status: '待处理'}, {title: '交易员确认（金额修正+合同上传）', user: '李华', time: '', status: '待处理'}, {title: '流程结束', user: '系统', time: '', status: '待处理'}] },
    // 买入-执行中（ERP完成，当前节点：交易员确认）
    { id: 'APR20260523001', type: '交易审批', object: 'TRX20260523001', objectName: '演示-在投-专户-买入', applicant: '李华', applyTime: '2026-05-23 09:00', status: '执行中', steps: [{title: '交易员发起', user: '李华', time: '2026-05-23 09:00', status: '已完成'}, {title: '投资经理审批', user: '张明', time: '2026-05-23 09:20', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-05-23 09:40', status: '已完成'}, {title: '部门经理审批', user: '孙磊', time: '2026-05-23 09:55', status: '已完成'}, {title: 'ERP流程-资金划拨（用款）', user: '系统', time: '2026-05-23 10:00', status: '已完成'}, {title: 'ERP流程-创新金融（资金划拨申请）', user: '系统', time: '2026-05-23 11:00', status: '已完成'}, {title: '交易员确认（金额修正+合同上传）', user: '李华', time: '', status: '当前'}, {title: '流程结束', user: '系统', time: '', status: '待处理'}] },
    // 买入-已驳回（风控节点驳回）
    { id: 'APR20260514001', type: '交易审批', object: 'TRX20260514001', objectName: '演示-在投-专户-买入', applicant: '李华', applyTime: '2026-05-14 15:00', status: '已驳回', steps: [{title: '交易员发起', user: '李华', time: '2026-05-14 15:00', status: '已完成'}, {title: '投资经理审批', user: '张明', time: '2026-05-14 16:00', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-05-14 17:00', status: '已完成', result: '驳回', reason: '申报金额超投资计划剩余额度'}, {title: '部门经理审批', user: '孙磊', time: '', status: '待处理'}, {title: 'ERP流程-资金划拨（用款）', user: '系统', time: '', status: '待处理'}, {title: 'ERP流程-创新金融（资金划拨申请）', user: '系统', time: '', status: '待处理'}, {title: '交易员确认（金额修正+合同上传）', user: '李华', time: '', status: '待处理'}, {title: '流程结束', user: '系统', time: '', status: '待处理'}] },
    // 买入-已撤回
    { id: 'APR20260512001', type: '交易审批', object: 'TRX20260512001', objectName: '演示-在投-信托-买入', applicant: '李华', applyTime: '2026-05-12 11:00', status: '已撤回', steps: [{title: '交易员发起', user: '李华', time: '2026-05-12 11:00', status: '已完成', result: '发起人撤回', reason: '市场波动撤回'}, {title: '投资经理审批', user: '张明', time: '', status: '待处理'}, {title: '风控审批', user: '刘伟', time: '', status: '待处理'}, {title: '部门经理审批', user: '孙磊', time: '', status: '待处理'}, {title: 'ERP流程-资金划拨（用款）', user: '系统', time: '', status: '待处理'}, {title: 'ERP流程-创新金融（资金划拨申请）', user: '系统', time: '', status: '待处理'}, {title: '交易员确认（金额修正+合同上传）', user: '李华', time: '', status: '待处理'}, {title: '流程结束', user: '系统', time: '', status: '待处理'}] },
    // 赎回-审批中（三级审批已通过，当前节点：财务对账确认，交易状态=交易执行中）
    { id: 'APR20260527001', type: '交易审批', object: 'TRX20260527001', objectName: '演示-在投-专户-赎回', applicant: '李华', applyTime: '2026-05-27 14:00', status: '审批中', steps: [{title: '交易员发起', user: '李华', time: '2026-05-27 14:00', status: '已完成'}, {title: '投资经理审批', user: '张明', time: '2026-05-27 15:00', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-05-27 16:00', status: '已完成'}, {title: '部门经理审批', user: '孙磊', time: '2026-05-28 09:30', status: '已完成'}, {title: '交易执行中-财务对账确认', user: '赵静', time: '', status: '当前'}, {title: '交易员补充信息', user: '李华', time: '', status: '待处理'}, {title: '流程结束', user: '系统', time: '', status: '待处理'}] },
    // 赎回-审批中（财务已确认，当前节点：交易员补充信息，交易状态=待交易员补充信息）
    { id: 'APR20260601002', type: '交易审批', object: 'TRX20260601001', objectName: '演示-在投-信托-赎回', applicant: '李华', applyTime: '2026-06-01 09:30', status: '审批中', steps: [{title: '交易员发起', user: '李华', time: '2026-06-01 09:30', status: '已完成'}, {title: '投资经理审批', user: '张明', time: '2026-06-01 10:30', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-06-01 14:00', status: '已完成'}, {title: '部门经理审批', user: '孙磊', time: '2026-06-01 16:00', status: '已完成'}, {title: '交易执行中-财务对账确认', user: '赵静', time: '2026-06-03 15:00', status: '已完成'}, {title: '交易员补充信息', user: '李华', time: '', status: '当前'}, {title: '流程结束', user: '系统', time: '', status: '待处理'}] },
    // 赎回-已通过（全流程结束）
    { id: 'APR20260602001', type: '交易审批', object: 'TRX20260602001', objectName: '演示-在投-信托-赎回', applicant: '李华', applyTime: '2026-06-02 10:00', status: '已通过', steps: [{title: '交易员发起', user: '李华', time: '2026-06-02 10:00', status: '已完成'}, {title: '投资经理审批', user: '张明', time: '2026-06-02 11:00', status: '已完成'}, {title: '风控审批', user: '刘伟', time: '2026-06-02 14:00', status: '已完成'}, {title: '部门经理审批', user: '孙磊', time: '2026-06-02 16:30', status: '已完成'}, {title: '交易执行中-财务对账确认', user: '赵静', time: '2026-06-05 09:40', status: '已完成'}, {title: '交易员补充信息', user: '李华', time: '2026-06-05 11:00', status: '已完成'}, {title: '流程结束', user: '系统', time: '2026-06-05 11:00', status: '已完成'}] },
    // 赎回-已终止（发起人主动终止）
    { id: 'APR20260521001', type: '交易审批', object: 'TRX20260521001', objectName: '演示-在投-专户-赎回', applicant: '李华', applyTime: '2026-05-21 09:30', status: '已终止', steps: [{title: '交易员发起', user: '李华', time: '2026-05-21 09:30', status: '已完成', result: '发起人终止', reason: '发起人主动终止交易'}, {title: '投资经理审批', user: '张明', time: '', status: '待处理'}, {title: '风控审批', user: '刘伟', time: '', status: '待处理'}, {title: '部门经理审批', user: '孙磊', time: '', status: '待处理'}, {title: '交易执行中-财务对账确认', user: '赵静', time: '', status: '待处理'}, {title: '交易员补充信息', user: '李华', time: '', status: '待处理'}, {title: '流程结束', user: '系统', time: '', status: '待处理'}] }
];

var FINANCES = [
    { id: 'FR20260517001', productId: 'P002', productName: '演示-在投-信托', changeType: '兑息兑付', changeDate: '2026-05-17', changeAmount: 500000, voucherStatus: '待确认', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260517001' },
    { id: 'FR20260517002', productId: 'P001', productName: '演示-在投-专户', changeType: '公允价值变更', changeDate: '2026-05-17', changeAmount: 300000, voucherStatus: '待确认', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260517002' },
    { id: 'FR20260516001', productId: 'P003', productName: '演示-在投-ABS', changeType: '申购', changeDate: '2026-05-16', changeAmount: 8000000, voucherStatus: '待确认', createMethod: '自动生成', source: '交易确认', voucherId: 'VCH20260517003' },
    { id: 'FR20260515001', productId: 'P003', productName: '演示-在投-ABS', changeType: '兑息兑付', changeDate: '2026-05-15', changeAmount: 120000, voucherStatus: '已确认', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260515001' },
    { id: 'FR20260510001', productId: 'P001', productName: '演示-在投-专户', changeType: '公允价值变更', changeDate: '2026-05-10', changeAmount: 450000, voucherStatus: '已确认', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260510001' },
    { id: 'FR20260505001', productId: 'P002', productName: '演示-在投-信托', changeType: '兑息兑付', changeDate: '2026-05-05', changeAmount: 200000, voucherStatus: '已推送NC', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260505001' },
    { id: 'FR20260430001', productId: 'P004', productName: '演示-在投-碳金融', changeType: '公允价值变更', changeDate: '2026-04-30', changeAmount: -380000, voucherStatus: '已推送NC', createMethod: '自动生成', source: '邮件解析', voucherId: 'VCH20260430001' },
    { id: 'FR20260425001', productId: 'P001', productName: '演示-在投-专户', changeType: '赎回', changeDate: '2026-04-25', changeAmount: 10000000, voucherStatus: '已推送NC', createMethod: '自动生成', source: '交易确认', voucherId: 'VCH20260425001' }
];

// 兑息兑付流程记录（财务发起→交易员确认→财务最终确认→生成凭证→推iBor）
// status: 待交易员确认 / 交易员已确认 / 已完成 / 已驳回
// pushIborStatus: 未推送 / 已推送 / 推送失败
var DIVIDENDS = [
    { id: 'DV20260517001', productId: 'P002', productName: '演示-在投-信托', innerCode: 'XT20260420001', externalCode: '', initiator: '赵静', divDate: '2026-05-17', interestPer100: 0.85, principalPer100: 0, remark: '5月利息兑付', status: '已完成', traderConfirmUser: '李华', traderConfirmTime: '2026-05-17 14:30', traderModified: false, traderRemark: '确认无误', financeConfirmUser: '赵静', financeConfirmTime: '2026-05-17 16:00', voucherId: 'VCH20260517001', pushIborStatus: '已推送', pushIborTime: '2026-05-17 17:30', createTime: '2026-05-17 10:00', history: [{ user: '赵静', action: '发起兑息兑付', time: '2026-05-17 10:00', remark: '5月利息' }, { user: '李华', action: '交易员确认', time: '2026-05-17 14:30', remark: '确认无误' }, { user: '赵静', action: '财务最终确认', time: '2026-05-17 16:00', remark: '' }, { user: '系统', action: '生成凭证VCH20260517001', time: '2026-05-17 16:01', remark: '' }, { user: '系统', action: '推送iBor', time: '2026-05-17 17:30', remark: '推送成功' }] },
    { id: 'DV20260515001', productId: 'P003', productName: '演示-在投-ABS', innerCode: 'ABS20260519001', externalCode: '1101010901', initiator: '赵静', divDate: '2026-05-15', interestPer100: 0.42, principalPer100: 0, remark: '5月利息', status: '已完成', traderConfirmUser: '李华', traderConfirmTime: '2026-05-15 11:00', traderModified: true, traderRemark: '每百元应付利息从0.38调整为0.42', financeConfirmUser: '赵静', financeConfirmTime: '2026-05-15 14:00', voucherId: 'VCH20260515001', pushIborStatus: '已推送', pushIborTime: '2026-05-15 17:30', createTime: '2026-05-15 09:00', history: [{ user: '赵静', action: '发起兑息兑付', time: '2026-05-15 09:00', remark: '' }, { user: '李华', action: '交易员确认（已修改字段）', time: '2026-05-15 11:00', remark: '每百元应付利息从0.38调整为0.42' }, { user: '赵静', action: '财务最终确认', time: '2026-05-15 14:00', remark: '' }, { user: '系统', action: '生成凭证VCH20260515001', time: '2026-05-15 14:01', remark: '' }, { user: '系统', action: '推送iBor', time: '2026-05-15 17:30', remark: '推送成功' }] },
    { id: 'DV20260505001', productId: 'P003', productName: '演示-在投-ABS', innerCode: 'ABS20260519001', externalCode: '1101010901', initiator: '赵静', divDate: '2026-05-05', interestPer100: 0.65, principalPer100: 2.5, remark: '5月本息兑付', status: '已完成', traderConfirmUser: '李华', traderConfirmTime: '2026-05-05 10:30', traderModified: false, traderRemark: '确认', financeConfirmUser: '赵静', financeConfirmTime: '2026-05-05 15:00', voucherId: 'VCH20260505001', pushIborStatus: '已推送', pushIborTime: '2026-05-05 17:30', createTime: '2026-05-05 09:00', history: [{ user: '赵静', action: '发起兑息兑付', time: '2026-05-05 09:00', remark: '' }, { user: '李华', action: '交易员确认', time: '2026-05-05 10:30', remark: '' }, { user: '赵静', action: '财务最终确认', time: '2026-05-05 15:00', remark: '' }, { user: '系统', action: '生成凭证VCH20260505001', time: '2026-05-05 15:01', remark: '' }, { user: '系统', action: '推送iBor', time: '2026-05-05 17:30', remark: '推送成功' }] },
    { id: 'DV20260803001', productId: 'P002', productName: '演示-在投-信托', innerCode: 'XT20260420001', externalCode: '', initiator: '赵静', divDate: '2026-08-03', interestPer100: 0.92, principalPer100: 0, remark: '8月利息兑付', status: '待交易员确认', traderConfirmUser: '', traderConfirmTime: '', traderModified: false, traderRemark: '', financeConfirmUser: '', financeConfirmTime: '', voucherId: '', pushIborStatus: '未推送', pushIborTime: '', createTime: '2026-08-03 10:00', history: [{ user: '赵静', action: '发起兑息兑付', time: '2026-08-03 10:00', remark: '8月利息' }] },
    { id: 'DV20260802001', productId: 'P003', productName: '演示-在投-ABS', innerCode: 'ABS20260519001', externalCode: '1101010901', initiator: '赵静', divDate: '2026-08-02', interestPer100: 0.48, principalPer100: 1.2, remark: '8月部分本息兑付', status: '交易员已确认', traderConfirmUser: '李华', traderConfirmTime: '2026-08-02 14:00', traderModified: true, traderRemark: '每百元应付本金从1.0调整为1.2', financeConfirmUser: '', financeConfirmTime: '', voucherId: '', pushIborStatus: '未推送', pushIborTime: '', createTime: '2026-08-02 09:30', history: [{ user: '赵静', action: '发起兑息兑付', time: '2026-08-02 09:30', remark: '' }, { user: '李华', action: '交易员确认（已修改字段）', time: '2026-08-02 14:00', remark: '每百元应付本金从1.0调整为1.2' }] },
    { id: 'DV20260728001', productId: 'P003', productName: '演示-在投-ABS', innerCode: 'ABS20260519001', externalCode: '1101010901', initiator: '赵静', divDate: '2026-07-28', interestPer100: 0, principalPer100: 3.5, remark: 'ABS本金兑付', status: '已驳回', traderConfirmUser: '李华', traderConfirmTime: '2026-07-28 11:00', traderModified: false, traderRemark: '', financeConfirmUser: '', financeConfirmTime: '', voucherId: '', pushIborStatus: '未推送', pushIborTime: '', createTime: '2026-07-28 09:00', history: [{ user: '赵静', action: '发起兑息兑付', time: '2026-07-28 09:00', remark: '' }, { user: '李华', action: '交易员驳回', time: '2026-07-28 11:00', remark: '该产品未到兑付日，请确认后再发起' }] }
];

var VOUCHERS = [
    { id: 'VCH20260517001', summary: '演示-在投-信托兑息兑付', debitAccount: '1122-应收利息', creditAccount: '6001-投资收益', amount: 500000, maker: '系统', makeTime: '2026-05-17 17:30' },
    { id: 'VCH20260517002', summary: '演示-在投-专户公允价值变动', debitAccount: '1101-交易性金融资产', creditAccount: '6101-公允价值变动损益', amount: 300000, maker: '系统', makeTime: '2026-05-17 17:30' },
    { id: 'VCH20260515001', summary: '演示-在投-ABS兑息兑付', debitAccount: '1122-应收利息', creditAccount: '6001-投资收益', amount: 120000, maker: '系统', makeTime: '2026-05-15 17:30' },
    { id: 'VCH20260510001', summary: '演示-在投-专户公允价值变动', debitAccount: '1101-交易性金融资产', creditAccount: '6101-公允价值变动损益', amount: 450000, maker: '系统', makeTime: '2026-05-10 17:30' },
    { id: 'VCH20260505001', summary: '演示-在投-ABS本息兑付', debitAccount: '1122-应收利息', creditAccount: '6001-投资收益', amount: 200000, maker: '系统', makeTime: '2026-05-05 17:30' },
    { id: 'VCH20260430001', summary: '演示-在投-碳金融公允价值变动', debitAccount: '6101-公允价值变动损益', creditAccount: '1101-交易性金融资产', amount: 380000, maker: '系统', makeTime: '2026-04-30 17:30' },
    { id: 'VCH20260425001', summary: '演示-在投-专户赎回', debitAccount: '1002-银行存款', creditAccount: '1101-交易性金融资产', amount: 10000000, maker: '系统', makeTime: '2026-04-25 17:30' },
    { id: 'VCH20260517003', summary: '演示-在投-ABS申购', debitAccount: '1101-交易性金融资产', creditAccount: '1002-银行存款', amount: 8000000, maker: '系统', makeTime: '2026-05-17 17:30' }
];

var CONTRACTS = [
    { id: 'CT20260310001', tradeId: 'TRX20260310001', productId: 'P001', productName: '演示-在投-专户', counterpartyId: 'CP002', counterpartyName: '第一创业', manager: '', type: '专户资管合同', amount: 10000000, signDate: '2026-03-10', expireDate: '', initFile: '演示-在投-专户合同_初始.pdf', sealFile: '演示-在投-专户合同_用印版.pdf', version: '用印版本', status: '已推送', remark: '' },
    { id: 'CT20260310002', tradeId: 'TRX20260310001', productId: 'P001', productName: '演示-在投-专户', counterpartyId: 'CP001', counterpartyName: '国泰君安', manager: '', type: '托管合同', amount: 10000000, signDate: '2026-03-12', expireDate: '', initFile: '演示-在投-专户托管合同_初始.pdf', sealFile: '', version: '初始版本', status: '待上传用印', remark: '托管人合同' }
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
        '未提交': 'status-pending', '待提交': 'status-pending', '审批中': 'status-processing', '已通过': 'status-approved', '已完结': 'status-completed',
        '草稿': 'status-pending', '待审批': 'status-processing', '已驳回': 'status-rejected', '已终止': 'status-frozen',
        '待投': 'status-pending', '在投': 'status-investing', '无计划': 'status-pending', '完结': 'status-completed', '禁用': 'status-frozen', '已到期': 'status-rejected',
        '在池': 'status-approved', '待入池': 'status-pending',
        '待确认': 'status-pending', '已确认': 'status-confirmed', '已推送NC': 'status-pushed',
        '已成交': 'status-approved', '待执行': 'status-processing', '执行中': 'status-processing', '已撤回': 'status-frozen',
        '买入': 'status-investing', '买入(开仓)': 'status-investing', '赎回': 'status-rejected',
        '待上传用印': 'status-pending', '待推送': 'status-processing', '已推送': 'status-pushed', '已签署': 'status-approved',
        '初始版本': 'status-pending', '用印版本': 'status-confirmed',
        '待生成': 'status-pending', '已生成': 'status-processing', '已审核': 'status-confirmed',
        '交易审批中': 'status-processing', '交易执行中': 'status-processing', '待交易员补充信息': 'status-processing'
    };
    return map[status] || 'status-pending';
}

function getChangeTypeClass(type) {
    var map = {'兑息兑付': 'type-dividend', '公允价值变更': 'type-fairvalue', '申购': 'type-plan-notice', '赎回': 'type-redeem', '内部往来': 'type-plan-notice'};
    return map[type] || 'type-plan-notice';
}

var NOTIFICATIONS = [
    { id: 'N005', type: '审批通知', level: 'normal', title: '新审批事项', content: '投资计划书ABS专项投资计划待审批', object: 'TP20260515001', page: 'approval.html', read: false, time: '1小时前' },
    { id: 'N009', type: '审批通知', level: 'normal', title: '新审批事项', content: '产品交易 演示-在投-信托-买入 待风控审批', object: 'TRX20260516001', page: 'approval.html', read: false, time: '30分钟前' },
    { id: 'N010', type: '审批通知', level: 'normal', title: '新审批事项', content: '兑息兑付 演示-在投-信托 8月利息待交易员确认', object: 'DV20260803001', page: 'approval.html', read: false, time: '10分钟前' },
    { id: 'N006', type: '审批结果', level: 'normal', title: '审批已处理', content: '2026年Q1演示-在投-专户投资计划已通过', object: 'TP20260301001', page: 'approval.html', read: true, time: '昨天' }
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
    var user = document.getElementById('username').value.trim();
    if (!user) { alert('请输入账号'); return; }
    var pwd = document.getElementById('password').value;
    if (!pwd) { alert('请输入登录密码'); return; }
    if (user !== 'oms' || pwd !== 'oms') { alert('账号或密码错误，请重新输入'); document.getElementById('password').value = ''; return; }
    sessionStorage.setItem('oms_role', 'demo');
    window.location.href = 'product.html';
});

function buildSidebar(activeHref) {
    var roleKey = getCurrentRoleKey();
    var html = '<div class="sidebar-brand"><div class="brand-icon">O</div><div class="brand-text">委外投资业务<br>一体化订单管理平台</div></div>';
    html += '<div class="sidebar-nav">';
    MENU_CONFIG.forEach(function(item) {
        if (item.roles.indexOf(roleKey) === -1) return;
        if (item.children && item.children.length > 0) {
            // 二级菜单：父级 + 子页面（子项激活时父级半高亮）
            var childActive = item.children.some(function(c) { return c.href === activeHref; });
            html += '<div class="nav-group">';
            html += '<div class="nav-item nav-group-title' + (childActive ? ' group-active' : '') + '"><span class="nav-icon">' + item.icon + '</span><span class="nav-label">' + item.label + '</span></div>';
            html += '<div class="nav-submenu">';
            item.children.forEach(function(c) {
                if (c.roles && c.roles.indexOf(roleKey) === -1) return;
                var ccls = c.href === activeHref ? ' active' : '';
                html += '<a href="' + c.href + '" class="nav-item nav-sub-item' + ccls + '"><span class="nav-label">' + c.label + '</span></a>';
            });
            html += '</div></div>';
        } else {
            var cls = item.href === activeHref ? ' active' : '';
            html += '<a href="' + item.href + '" class="nav-item' + cls + '"><span class="nav-icon">' + item.icon + '</span><span class="nav-label">' + item.label + '</span></a>';
        }
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
        html += '<div class="notification-item" data-level="' + n.level + '" style="' + bg + fw + '" onclick="handleDropdownNotifClick(\'' + n.id + '\')">';
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

// 右上角下拉面板点击：审批类通知跳转审批中心并自动打开弹窗，其他通知正常跳转
function handleDropdownNotifClick(id) {
    var n = NOTIFICATIONS.find(function(x) { return x.id === id; });
    if (!n) return;
    n.read = true;
    var url = n.page || 'profile.html';
    // 审批类通知（page指向approval.html且有关联对象）追加openApproval参数，目标页自动打开审批详情弹窗
    if (n.object && url.indexOf('approval.html') >= 0) {
        url += (url.indexOf('?') >= 0 ? '&' : '?') + 'openApproval=' + encodeURIComponent(n.object);
    }
    location.href = url;
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

// ==================== 弹窗拖拽功能 ====================
(function() {
    var dragModal = null;
    var startX = 0, startY = 0;
    var offsetX = 0, offsetY = 0;
    var isDragging = false;

    function onMouseDown(e) {
        var header = e.target.closest('.modal-header');
        if (!header) return;
        var btn = e.target.closest('.btn, button, a, input, select, textarea');
        if (btn) return;
        var content = header.closest('.modal-content');
        var modal = header.closest('.modal');
        if (!content || !modal) return;
        if (content.style.position !== 'fixed') {
            content.style.position = 'fixed';
            var rect = content.getBoundingClientRect();
            content.style.left = rect.left + 'px';
            content.style.top = rect.top + 'px';
            content.style.transform = 'none';
            content.style.margin = '0';
        }
        isDragging = true;
        dragModal = content;
        startX = e.clientX;
        startY = e.clientY;
        offsetX = parseInt(content.style.left || 0);
        offsetY = parseInt(content.style.top || 0);
        content.classList.add('dragging');
        e.preventDefault();
    }

    function onMouseMove(e) {
        if (!isDragging || !dragModal) return;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        var newLeft = offsetX + dx;
        var newTop = offsetY + dy;
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        var w = dragModal.offsetWidth;
        var h = dragModal.offsetHeight;
        newLeft = Math.max(-w / 2 + 20, Math.min(vw - w / 2 - 20, newLeft));
        newTop = Math.max(0, Math.min(vh - 60, newTop));
        dragModal.style.left = newLeft + 'px';
        dragModal.style.top = newTop + 'px';
    }

    function onMouseUp() {
        if (dragModal) dragModal.classList.remove('dragging');
        isDragging = false;
        dragModal = null;
    }

    function resetModalPosition(e) {
        if (!e.target.classList.contains('modal')) return;
        var content = e.target.querySelector('.modal-content');
        if (content && content.style.position === 'fixed') {
            content.style.position = 'relative';
            content.style.left = '';
            content.style.top = '';
            content.style.transform = '';
            content.style.margin = '';
            content.classList.remove('dragging');
        }
    }

    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('click', resetModalPosition, true);
})();

window.addEventListener('DOMContentLoaded', function() {
    initNotification();
});
