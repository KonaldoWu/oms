// 审批详情公共组件 - 供审批中心(approval.html)和通知中心(profile.html)复用
// 依赖：script.js（全局数据 APPROVALS/DIVIDENDS/TRADES/PRODUCTS/VOUCHERS/FINANCES + 权限函数）
// 用法：openApprovalDetail(业务对象ID)  如 TP20260515001 / TRX20260516001 / DV20260803001

// ============ 动态注入CSS（仅注入一次） ============
if (!document.getElementById('approval-detail-style')) {
    var _adStyle = document.createElement('style');
    _adStyle.id = 'approval-detail-style';
    _adStyle.textContent = ''
        + '.timeline { position: relative; padding-left: 24px; }'
        + '.timeline::before { content: ""; position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background: var(--border); }'
        + '.timeline-item { position: relative; padding-bottom: 20px; }'
        + '.timeline-item:last-child { padding-bottom: 0; }'
        + '.timeline-dot { position: absolute; left: -20px; top: 2px; width: 12px; height: 12px; border-radius: 50%; z-index: 1; }'
        + '.timeline-dot.completed { background: var(--success, #22c55e); }'
        + '.timeline-dot.current { background: var(--primary, #3b82f6); box-shadow: 0 0 0 4px rgba(59,130,246,0.2); }'
        + '.timeline-dot.pending { background: var(--border, #e5e7eb); }'
        + '.timeline-dot.rejected { background: var(--danger, #ef4444); }'
        + '.timeline-title { font-size: var(--font-size-sm); font-weight: 600; color: var(--text-primary); }'
        + '.timeline-title.pending-title { color: var(--text-muted); }'
        + '.timeline-user { font-size: var(--font-size-xs); color: var(--text-secondary); margin-top: 2px; }'
        + '.timeline-time { font-size: var(--font-size-xs); color: var(--text-muted); margin-top: 1px; }'
        + '.timeline-reason { font-size: var(--font-size-xs); color: var(--danger); margin-top: 2px; padding: 4px 8px; background: #FEF2F2; border-radius: 3px; }'
        + '.detail-section-title { font-size: var(--font-size-sm); font-weight: 600; color: var(--text-primary); margin: 16px 0 10px; padding-bottom: 6px; border-bottom: 1px solid var(--border); }'
        + '.detail-object-link { color: var(--primary); cursor: pointer; text-decoration: underline; }'
        + '.detail-object-link:hover { color: var(--primary-dark, #2563eb); }'
        + '.opinion-input { width: 100%; padding: 8px 10px; border: 1px solid var(--border); border-radius: var(--radius); font-size: var(--font-size-sm); resize: vertical; min-height: 60px; margin-top: 8px; }'
        + '.opinion-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }'
        + '.suggest-panel { border: 1px dashed var(--border); border-radius: var(--radius); background: var(--border-light); padding: 8px 10px; margin-bottom: 10px; }'
        + '.suggest-panel-title { font-size: var(--font-size-xs); color: var(--text-muted); margin-bottom: 6px; }'
        + '.suggest-item { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 7px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); margin-bottom: 6px; cursor: pointer; font-size: var(--font-size-xs); transition: border-color 0.15s; }'
        + '.suggest-item:last-child { margin-bottom: 0; }'
        + '.suggest-item:hover { border-color: var(--primary); }'
        + '.suggest-item .suggest-name { font-weight: 600; color: var(--text-primary); }'
        + '.suggest-item .suggest-meta { color: var(--text-muted); }'
        + '.suggest-item .suggest-reason { color: var(--text-secondary); flex: 1; min-width: 160px; text-align: right; }';
    document.head.appendChild(_adStyle);
}

// ============ 配置 ============
var AD_TYPE_CONFIG = {
    '投资计划书审批': { key: 'plan', icon: '📋', iconClass: 'icon-plan', label: '计划书审批' },
    '产品入池审批': { key: 'product', icon: '📦', iconClass: 'icon-product', label: '产品入池' },
    '交易审批': { key: 'trade', icon: '💱', iconClass: 'icon-trade', label: '交易审批' },
    '兑息兑付确认': { key: 'dividend', icon: '💵', iconClass: 'icon-finance', label: '兑息兑付' }
};

var AD_OBJECT_LINK_MAP = {
    '投资计划书审批': 'trade.html',
    '产品入池审批': 'product.html',
    '交易审批': 'trade.html',
    '兑息兑付确认': 'finance.html'
};

var AD_APPROVAL_TYPE_PERM = {
    '投资计划书审批': 'approvePlan',
    '产品入池审批': 'approveProduct',
    '交易审批': 'approvePlan'
};

// ============ 状态 ============
var _adCurrentRejectId = null;
var _adCurrentTerminateId = null;
var _adModalsInjected = false;

// ============ 动态注入Modal HTML ============
function _adEnsureModals() {
    if (_adModalsInjected) return;
    _adModalsInjected = true;

    var detailModal = document.createElement('div');
    detailModal.id = 'adDetailModal';
    detailModal.className = 'modal';
    detailModal.innerHTML = ''
        + '<div class="modal-content" style="width:700px;">'
        +   '<div class="modal-header"><h3 id="adDetailModalTitle">审批详情</h3><button class="btn btn-ghost btn-sm" onclick="closeAdDetailModal()">✕</button></div>'
        +   '<div class="modal-body" id="adDetailModalBody"></div>'
        +   '<div class="modal-footer" id="adDetailModalFooter"></div>'
        + '</div>';
    document.body.appendChild(detailModal);

    var rejectModal = document.createElement('div');
    rejectModal.id = 'adRejectModal';
    rejectModal.className = 'modal';
    rejectModal.innerHTML = ''
        + '<div class="modal-content" style="width:480px;">'
        +   '<div class="modal-header"><h3>驳回审批</h3><button class="btn btn-ghost btn-sm" onclick="closeAdRejectModal()">✕</button></div>'
        +   '<div class="modal-body">'
        +     '<div class="form-group"><label>驳回原因 <span style="color:var(--danger);">*</span></label>'
        +     '<textarea id="adRejectReason" rows="4" placeholder="请输入驳回原因（必填）..." style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:var(--font-size-sm);resize:vertical;"></textarea>'
        +     '</div>'
        +   '</div>'
        +   '<div class="modal-footer"><button class="btn btn-ghost" onclick="closeAdRejectModal()">取消</button><button class="btn btn-danger" onclick="confirmAdReject()">确认驳回</button></div>'
        + '</div>';
    document.body.appendChild(rejectModal);

    var terminateModal = document.createElement('div');
    terminateModal.id = 'adTerminateModal';
    terminateModal.className = 'modal';
    terminateModal.innerHTML = ''
        + '<div class="modal-content" style="width:480px;">'
        +   '<div class="modal-header"><h3>终止审批</h3><button class="btn btn-ghost btn-sm" onclick="closeAdTerminateModal()">✕</button></div>'
        +   '<div class="modal-body">'
        +     '<div class="form-group"><label>终止原因 <span style="color:var(--danger);">*</span></label>'
        +     '<textarea id="adTerminateReason" rows="4" placeholder="请输入终止原因（必填）..." style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:var(--font-size-sm);resize:vertical;"></textarea>'
        +     '</div>'
        +   '</div>'
        +   '<div class="modal-footer"><button class="btn btn-ghost" onclick="closeAdTerminateModal()">取消</button><button class="btn btn-danger" onclick="confirmAdTerminate()">确认终止</button></div>'
        + '</div>';
    document.body.appendChild(terminateModal);

    // 点击遮罩关闭
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('adDetailModal')) closeAdDetailModal();
        if (event.target === document.getElementById('adRejectModal')) closeAdRejectModal();
        if (event.target === document.getElementById('adTerminateModal')) closeAdTerminateModal();
    });
}

// ============ 辅助：兼容获取角色/权限 ============
function _adRoleLabel() { return getCurrentRole().label; }
function _adIsReadOnly() { return isReadOnly(); }
function _adCanApprovePlan() { return hasPermission('approvePlan'); }
function _adCanApproveProduct() { return hasPermission('approveProduct'); }
function _adSafeRenderList() { if (typeof renderApprovalList === 'function') renderApprovalList(); }

// ============ 核心入口：根据业务对象ID打开审批详情弹窗 ============
// objectId 支持：审批ID(APR)、计划书ID(TP)、交易ID(TRX)、兑息兑付ID(DV)
function openApprovalDetail(objectId) {
    _adEnsureModals();
    var a = null;

    // 1. 直接按审批ID查找
    a = APPROVALS.find(function(x) { return x.id === objectId; });
    // 2. 按业务对象ID在APPROVALS中查找
    if (!a) a = APPROVALS.find(function(x) { return x.object === objectId; });
    // 3. 兑息兑付：按DV ID在DIVIDENDS中查找
    if (!a) {
        var d = DIVIDENDS.find(function(x) { return x.id === objectId; });
        if (d) a = _adBuildDividendApproval(d);
    }
    if (!a) { alert('未找到对应的审批记录: ' + objectId); return; }

    if (a.type === '兑息兑付确认') {
        _adRenderDividendDetail(a);
        return;
    }
    _adRenderApprovalDetail(a);
}

// ============ 渲染普通审批详情 ============
function _adRenderApprovalDetail(a) {
    var cfg = AD_TYPE_CONFIG[a.type] || {};
    document.getElementById('adDetailModalTitle').textContent = cfg.icon + ' ' + (cfg.label || a.type) + ' - ' + a.id;

    var linkPage = AD_OBJECT_LINK_MAP[a.type] || '#';
    var objectLink = '<span class="detail-object-link" onclick="window.open(\'' + linkPage + '\', \'_blank\')">' + a.object + ' ' + a.objectName + ' ↗</span>';

    var body = '<div class="detail-info-grid" style="grid-template-columns:1fr 1fr;margin-bottom:14px;">';
    body += '<div class="detail-info-item"><div class="info-label">审批编号</div><div class="info-value">' + a.id + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">审批类型</div><div class="info-value">' + a.type + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">关联对象</div><div class="info-value">' + objectLink + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">发起人</div><div class="info-value">' + a.applicant + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">发起时间</div><div class="info-value">' + a.applyTime + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">当前状态</div><div class="info-value"><span class="status-badge ' + getStatusClass(a.status) + '">' + a.status + '</span></div></div>';
    body += '</div>';

    body += '<div class="detail-section-title">审批流程</div>';
    body += '<div class="timeline">';
    a.steps.forEach(function(step) {
        var dotClass = 'pending';
        var titleClass = '';
        if (step.status === '已完成') {
            dotClass = step.result === '驳回' ? 'rejected' : 'completed';
        } else if (step.status === '当前') {
            dotClass = 'current';
        } else {
            titleClass = ' pending-title';
        }
        body += '<div class="timeline-item">';
        body += '<div class="timeline-dot ' + dotClass + '"></div>';
        body += '<div class="timeline-title' + titleClass + '">' + step.title + '</div>';
        if (step.user) body += '<div class="timeline-user">' + step.user + '</div>';
        if (step.time) body += '<div class="timeline-time">' + step.time + '</div>';
        if (step.status === '当前' && !step.time) body += '<div class="timeline-time" style="color:var(--primary);">待处理</div>';
        if (step.status === '待处理') body += '<div class="timeline-time">待处理</div>';
        if (step.result === '驳回' && step.reason) body += '<div class="timeline-reason">驳回原因: ' + step.reason + '</div>';
        body += '</div>';
    });
    body += '</div>';

    var typePermKey = AD_APPROVAL_TYPE_PERM[a.type];
    var canApproveThisType = typePermKey ? hasPermission(typePermKey) : false;
    var isReadOnlyRole = _adIsReadOnly();
    if (a.status === '审批中' && canApproveThisType && !isReadOnlyRole) {
        body += '<div class="detail-section-title">审批意见</div>';
        body += '<textarea id="adApprovalOpinion" class="opinion-input" rows="3" placeholder="请输入审批意见（选填）..."></textarea>';
    }

    document.getElementById('adDetailModalBody').innerHTML = body;
    var footer = document.getElementById('adDetailModalFooter');
    var isInitiator = a.applicant === _adRoleLabel();
    if (a.status === '审批中' && !isReadOnlyRole) {
        var curStep = a.steps.find(function(s) { return s.status === '当前'; });
        var approveBtnText = (curStep && curStep.title.indexOf('ERP流程') >= 0) ? '模拟完成' : '通过';
        var footerHtml = '<button class="btn btn-ghost" onclick="closeAdDetailModal()">关闭</button>';
        if (canApproveThisType) {
            footerHtml += '<button class="btn btn-danger" onclick="closeAdDetailModal();openAdRejectModal(\'' + a.id + '\')">驳回</button>';
            footerHtml += '<button class="btn btn-primary" onclick="approveAdItem(\'' + a.id + '\')">' + approveBtnText + '</button>';
        }
        if (isInitiator) {
            footerHtml += '<button class="btn btn-withdraw" onclick="withdrawAdApproval(\'' + a.id + '\')">撤回</button>';
            footerHtml += '<button class="btn btn-ghost" onclick="closeAdDetailModal();openAdTerminateModal(\'' + a.id + '\')">终止</button>';
        }
        footer.innerHTML = footerHtml;
    } else {
        footer.innerHTML = '<button class="btn btn-ghost" onclick="closeAdDetailModal()">关闭</button>';
    }
    document.getElementById('adDetailModal').style.display = 'block';
}

// ============ 构建兑息兑付审批对象 ============
function _adBuildDividendApproval(d) {
    // 流程：财务发起 → 交易员关联产品并确认（确认即结束；后台静默生成凭证+待还款，界面不展示）
    var steps = [];
    steps.push({ title: '财务发起', user: d.initiator, time: d.createTime, status: '已完成' });
    if (d.status === '待交易员确认') {
        steps.push({ title: '交易员确认', user: '待分配', time: '', status: '当前' });
    } else if (d.status === '已完成') {
        steps.push({ title: '交易员确认', user: d.traderConfirmUser, time: d.traderConfirmTime, status: '已完成', result: d.traderModified ? '已修改' : '确认', reason: d.traderRemark });
    } else if (d.status === '已驳回') {
        steps.push({ title: '交易员确认', user: d.traderConfirmUser, time: d.traderConfirmTime, status: '已完成', result: '驳回', reason: d.traderRemark });
    }
    return {
        id: d.id,
        type: '兑息兑付确认',
        object: d.id,
        objectName: d.productName
            ? d.productName + ' - 本金 ¥' + _adFmtPM(d.payPrincipal) + ' / 利息 ¥' + _adFmtPM(d.payInterest)
            : (d.source || '兑息兑付') + ' ¥' + _adFmtPM(d.arrivalAmount) + '（待关联产品）',
        applicant: d.initiator,
        applyTime: d.createTime,
        status: d.status === '待交易员确认' ? '审批中' : d.status === '已完成' ? '已通过' : '已驳回',
        steps: steps,
        _dividendData: d
    };
}

// ===== 兑息兑付辅助函数（自包含，供通知中心使用） =====
function _adFmtPM(n) {
    if (n === undefined || n === null || n === '' || isNaN(Number(n))) return '-';
    return Number(n).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function _adDvEligibleProducts() {
    return PRODUCTS.filter(function(p) {
        return p.status === '在投' && (p.assetType === '信托' || p.assetType === 'ABS(中保登)') && (p.holdAmount || 0) > 0;
    });
}

// ============ 渲染兑息兑付详情 ============
function _adRenderDividendDetail(a) {
    var d = a._dividendData;
    var cfg = AD_TYPE_CONFIG[a.type] || {};
    document.getElementById('adDetailModalTitle').textContent = cfg.icon + ' ' + (cfg.label || a.type) + ' - ' + a.id;
    var roleKey = getCurrentRoleKey();
    var canEdit = !_adIsReadOnly();
    var isTraderStep = (d.status === '待交易员确认' && (roleKey === 'trader' || roleKey === 'demo'));

    // ===== 申请信息 =====
    var body = '<div class="detail-info-grid" style="grid-template-columns:1fr 1fr;margin-bottom:14px;">';
    body += '<div class="detail-info-item"><div class="info-label">审批编号</div><div class="info-value">' + a.id + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">审批类型</div><div class="info-value">' + a.type + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">发起人</div><div class="info-value">' + d.initiator + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">发起时间</div><div class="info-value">' + d.createTime + '</div></div>';
    if (d.productName) {
        body += '<div class="detail-info-item"><div class="info-label">关联产品</div><div class="info-value">' + d.productName + ' (' + d.productId + ')</div></div>';
        body += '<div class="detail-info-item"><div class="info-label">产品内部编码</div><div class="info-value">' + (d.innerCode || '-') + '</div></div>';
        body += '<div class="detail-info-item"><div class="info-label">产品外部编码</div><div class="info-value">' + (d.externalCode || '-') + '</div></div>';
    } else {
        body += '<div class="detail-info-item"><div class="info-label">关联产品</div><div class="info-value" style="color:var(--text-muted);">待交易员关联</div></div>';
    }
    body += '<div class="detail-info-item"><div class="info-label">数据来源</div><div class="info-value">' + (d.source || '-') + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">当前状态</div><div class="info-value"><span class="status-badge ' + getStatusClass(d.status) + '">' + d.status + '</span></div></div>';
    body += '</div>';

    // ===== 来源信息（按来源类型展示关键字段） =====
    if (d.source === '回单OCR') {
        body += '<div class="detail-section-title">来源信息（银行回单OCR）</div>';
        body += '<div class="detail-info-grid" style="grid-template-columns:1fr 1fr;margin-bottom:10px;">';
        body += '<div class="detail-info-item"><div class="info-label">来源文件</div><div class="info-value">' + (d.sourceFile || '-') + '</div></div>';
        body += '<div class="detail-info-item"><div class="info-label">电子回单号码</div><div class="info-value text-mono">' + (d.receiptNo || '-') + '</div></div>';
        body += '<div class="detail-info-item" style="grid-column:1/3;"><div class="info-label">付款人户名</div><div class="info-value">' + (d.payerName || '-') + '</div></div>';
        body += '</div>';
    } else if (d.source === 'Excel导入') {
        body += '<div class="detail-section-title">来源信息（Excel表格解析）</div>';
        body += '<div class="detail-info-grid" style="grid-template-columns:1fr 1fr;margin-bottom:10px;">';
        body += '<div class="detail-info-item"><div class="info-label">来源文件</div><div class="info-value">' + (d.sourceFile || '-') + '</div></div>';
        body += '<div class="detail-info-item"><div class="info-label">债券代码</div><div class="info-value text-mono">' + (d.bondCode || '-') + '</div></div>';
        body += '<div class="detail-info-item"><div class="info-label">债券名称</div><div class="info-value">' + (d.bondName || '-') + '</div></div>';
        body += '</div>';
    }

    // ===== 到账信息（交易员可修正；无到账数据的历史记录不展示） =====
    var _inputStyle = 'width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:var(--radius);font-size:var(--font-size-sm);';
    var _labelStyle = 'font-size:var(--font-size-xs);color:var(--text-muted);';
    var _hasArrival = (d.arrivalAmount !== undefined && d.arrivalAmount !== null && d.arrivalAmount !== '');
    if ((isTraderStep && canEdit) || _hasArrival) {
        body += '<div class="detail-section-title">到账信息</div>';
    }
    if (isTraderStep && canEdit) {
        body += '<div class="detail-info-grid" style="grid-template-columns:1fr 1fr;margin-bottom:4px;">';
        body += '<div class="detail-info-item"><div class="info-label">到账金额</div><div class="info-value">' + _adFmtPM(d.arrivalAmount) + ' 元</div></div>';
        body += '</div>';
        body += '<div style="font-size:var(--font-size-xs);color:var(--text-muted);margin-bottom:10px;">兑付本金/兑付利息由交易员按兑付公告填写；应付合计（本金+利息）须等于到账金额，否则不可提交。</div>';
    } else if (_hasArrival) {
        body += '<div class="detail-info-grid" style="grid-template-columns:1fr 1fr;margin-bottom:10px;">';
        body += '<div class="detail-info-item"><div class="info-label">到账金额</div><div class="info-value">' + _adFmtPM(d.arrivalAmount) + ' 元</div></div>';
        body += '</div>';
    }

    // ===== 兑息兑付信息（iBor兑息兑付字段） =====
    body += '<div class="detail-section-title">兑息兑付信息（iBor兑息兑付字段）</div>';
    if (isTraderStep && canEdit) {
        // --- 关联产品（直接选定，一步完成，确认即流程结束） ---
        body += '<div class="form-group" style="margin-bottom:6px;"><label style="' + _labelStyle + '">关联产品 <span style="color:var(--danger);">*</span>（在投信托/ABS产品，兑付本金按持仓金额口径冲减）</label>';
        body += '<select id="adDivMatchProduct" onchange="onAdDvProductChange()" style="' + _inputStyle + '">';
        body += '<option value="">请选择关联产品</option>';
        _adDvEligibleProducts().forEach(function(p) {
            body += '<option value="' + p.id + '">' + p.name + '（' + p.assetType + '，持仓金额 ' + _adFmtPM(p.holdAmount) + ' 元）</option>';
        });
        body += '</select></div>';
        body += '<div id="adDivMatchHoldTip" style="font-size:var(--font-size-xs);color:var(--text-muted);margin-bottom:10px;"></div>';

        // --- 兑付数据（只填本金与利息；系统校验本金+利息=到账金额；支持万元/元单位切换，默认万元） ---
        body += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">'
            + '<span style="font-size:var(--font-size-xs);color:var(--text-muted);">金额单位</span>'
            + '<div style="display:inline-flex;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;">'
            + '<button id="adDvUnitWan" onclick="setAdDvUnit(\'wan\')" style="padding:4px 14px;font-size:var(--font-size-xs);border:none;cursor:pointer;">万元</button>'
            + '<button id="adDvUnitYuan" onclick="setAdDvUnit(\'yuan\')" style="padding:4px 14px;font-size:var(--font-size-xs);border:none;cursor:pointer;">元</button>'
            + '</div>'
            + '<span style="font-size:var(--font-size-xs);color:var(--text-muted);">默认万元（2 位小数）；切换为元后保留 6 位小数</span></div>';
        body += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 16px;">';
        body += '<div class="form-group"><label style="' + _labelStyle + '">兑付日期</label><div style="padding:6px 8px;font-size:var(--font-size-sm);">' + d.divDate + '</div></div>';
        body += '<div class="form-group"><label style="' + _labelStyle + '">兑付本金(<span class="adDvUnitLabel">万元</span>)</label><input type="number" step="0.01" id="adDivEditPrincipal" style="' + _inputStyle + '" value="' + (d.payPrincipal ? (d.payPrincipal / 10000).toFixed(2) : '') + '" placeholder="纯付息填 0；按持仓金额口径冲减持仓" oninput="updateAdDvCheckTip()"></div>';
        body += '<div class="form-group"><label style="' + _labelStyle + '">兑付利息(<span class="adDvUnitLabel">万元</span>) <span style="color:var(--danger);">*</span></label><input type="number" step="0.01" id="adDivEditInterest" style="' + _inputStyle + '" value="' + (d.payInterest ? (d.payInterest / 10000).toFixed(2) : '') + '" placeholder="按兑付公告填写" oninput="updateAdDvCheckTip()"></div>';
        body += '<div class="form-group"><label style="' + _labelStyle + '">备注</label><input type="text" id="adDivEditRemark" style="' + _inputStyle + '" value="' + (d.remark || '') + '"></div>';
        // 对账结果（系统实时提示）：本金+利息 须等于到账金额
        body += '<div id="adDvReconTip" style="grid-column:1/-1;display:none;font-size:var(--font-size-xs);"></div>';
        // 参考条（系统算，只读）：当前持仓本金 + 每百元应计本金/利息
        body += '<div style="grid-column:1/-1;background:var(--info-bg);border:1px solid #BFDBFE;border-radius:var(--radius);padding:8px 12px;font-size:var(--font-size-xs);color:var(--primary-active);line-height:1.9;">'
            + '当前持仓本金：<b id="adDvHoldPrincipalShow">-</b> 元　｜　每百元应计本金：<b id="adDvPer100Principal">-</b> 元　｜　每百元应计利息：<b id="adDvPer100Interest">-</b> 元'
            + '<br><span style="color:var(--text-muted);">每百元应计 = 兑付金额 ÷ 当前持仓本金 × 100（随填写实时计算，供核对兑付公告）</span></div>';
        body += '</div>';
        body += '<div class="form-group"><label style="' + _labelStyle + '">确认备注 / 驳回原因</label><textarea id="adDivTraderRemark" rows="2" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:var(--font-size-sm);resize:vertical;" placeholder="选填；确认时作为备注，驳回时作为驳回原因"></textarea></div>';
        body += '<input type="hidden" id="adDivRejectReason" value="">';
    } else {
        body += '<div class="detail-info-grid" style="grid-template-columns:1fr 1fr;margin-bottom:6px;">';
        body += '<div class="detail-info-item"><div class="info-label">兑付日期</div><div class="info-value">' + d.divDate + '</div></div>';
        body += '<div class="detail-info-item"><div class="info-label">兑付本金</div><div class="info-value">' + _adFmtPM(d.payPrincipal) + ' 元</div></div>';
        body += '<div class="detail-info-item"><div class="info-label">兑付利息</div><div class="info-value">' + _adFmtPM(d.payInterest) + ' 元</div></div>';
        body += '<div class="detail-info-item" style="grid-column:1/3;"><div class="info-label">备注</div><div class="info-value">' + (d.remark || '-') + '</div></div>';
        body += '</div>';
        if (d.traderConfirmUser) {
            body += '<div class="detail-info-grid" style="grid-template-columns:1fr 1fr;margin-bottom:6px;">';
            body += '<div class="detail-info-item"><div class="info-label">交易员确认</div><div class="info-value">' + d.traderConfirmUser + ' ' + d.traderConfirmTime + (d.traderModified ? '（已修改字段）' : '') + '</div></div>';
            body += '<div class="detail-info-item" style="grid-column:1/3;"><div class="info-label">交易员备注</div><div class="info-value">' + (d.traderRemark || '-') + '</div></div>';
            if (d.diffRemark) body += '<div class="detail-info-item" style="grid-column:1/3;"><div class="info-label">差异说明</div><div class="info-value">' + d.diffRemark + '</div></div>';
            body += '</div>';
        }
    }

    body += '<div class="detail-section-title">处理记录</div>';
    body += '<div class="timeline">';
    d.history.forEach(function(h) {
        body += '<div class="timeline-item">';
        body += '<div class="timeline-dot completed"></div>';
        body += '<div class="timeline-title">' + h.action + '</div>';
        if (h.user) body += '<div class="timeline-user">' + h.user + '</div>';
        if (h.time) body += '<div class="timeline-time">' + h.time + '</div>';
        if (h.remark) body += '<div class="timeline-time" style="color:var(--text-secondary);">' + h.remark + '</div>';
        body += '</div>';
    });
    body += '</div>';

    document.getElementById('adDetailModalBody').innerHTML = body;
    if (isTraderStep && canEdit) { _adDvCurArrival = d.arrivalAmount || 0; _adDvUnit = 'wan'; _applyAdDvUnitUI(); updateAdDvCheckTip(); }
    var footer = document.getElementById('adDetailModalFooter');
    var footerHtml = '<button class="btn btn-ghost" onclick="closeAdDetailModal()">关闭</button>';
    if (canEdit) {
        if (isTraderStep) {
            footerHtml += '<button class="btn btn-danger" onclick="rejectAdDividend(\'' + d.id + '\')">驳回</button>';
            footerHtml += '<button class="btn btn-primary" onclick="confirmAdDividend(\'' + d.id + '\')">关联产品并确认（流程结束）</button>';
        }
    }
    footer.innerHTML = footerHtml;
    document.getElementById('adDetailModal').style.display = 'block';
}

// ===== 下拉选择产品：展示持仓金额 =====
function onAdDvProductChange() {
    var pid = document.getElementById('adDivMatchProduct').value;
    var prod = PRODUCTS.find(function(p) { return p.id === pid; });
    var tip = document.getElementById('adDivMatchHoldTip');
    if (!prod) { if (tip) tip.innerHTML = ''; updateAdDvCheckTip(); return; }
    if (tip) tip.innerHTML = '已选产品持仓金额：<b>' + _adFmtPM(prod.holdAmount) + ' 元</b>，内部编码 ' + (prod.hengtaiCode || '-') + ' / 外部编码 ' + (prod.externalCode || '-') + '；兑付本金按持仓金额口径冲减，兑付本金不可超过持仓金额。';
    updateAdDvCheckTip();
}
// ===== 金额单位切换（万元/元，默认万元；元 6 位小数、万元 2 位小数） =====
var _adDvUnit = 'wan';
var _adDvCurArrival = 0; // 当前单据到账金额（元），供对账结果实时提示
function setAdDvUnit(unit) {
    if (unit !== 'wan' && unit !== 'yuan') return;
    if (unit === _adDvUnit) { _applyAdDvUnitUI(); return; }
    // 切换前把已填数值按旧单位换算为元，再按新单位回填
    ['adDivEditPrincipal', 'adDivEditInterest'].forEach(function(id) {
        var el = document.getElementById(id);
        if (!el || el.value === '') return;
        var v = parseFloat(el.value);
        if (isNaN(v)) return;
        var yuan = _adDvUnit === 'wan' ? v * 10000 : v;
        el.value = unit === 'wan' ? (yuan / 10000).toFixed(2) : (Math.round(yuan * 1000000) / 1000000).toFixed(6);
    });
    _adDvUnit = unit;
    _applyAdDvUnitUI();
    updateAdDvCheckTip();
}
function _applyAdDvUnitUI() {
    var onStyle = 'padding:4px 14px;font-size:var(--font-size-xs);border:none;cursor:pointer;background:var(--primary);color:#fff;';
    var offStyle = 'padding:4px 14px;font-size:var(--font-size-xs);border:none;cursor:pointer;background:var(--surface);color:var(--text-secondary);';
    var wanBtn = document.getElementById('adDvUnitWan');
    var yuanBtn = document.getElementById('adDvUnitYuan');
    if (wanBtn) wanBtn.style.cssText = _adDvUnit === 'wan' ? onStyle : offStyle;
    if (yuanBtn) yuanBtn.style.cssText = _adDvUnit === 'yuan' ? onStyle : offStyle;
    var label = _adDvUnit === 'wan' ? '万元' : '元';
    document.querySelectorAll('#adDetailModalBody .adDvUnitLabel').forEach(function(s) { s.textContent = label; });
    var step = _adDvUnit === 'wan' ? '0.01' : '0.000001';
    var pEl = document.getElementById('adDivEditPrincipal');
    var iEl = document.getElementById('adDivEditInterest');
    if (pEl) pEl.step = step;
    if (iEl) iEl.step = step;
}
// 输入值按当前单位换算为元（6 位小数）
function _adDvInputToYuan(id) {
    var el = document.getElementById(id);
    var v = parseFloat(el && el.value);
    if (isNaN(v)) return 0;
    var yuan = _adDvUnit === 'wan' ? v * 10000 : v;
    return Math.round(yuan * 1000000) / 1000000;
}
// 参考条刷新：当前持仓本金 + 每百元应计本金/利息（系统算，只读，随填写实时计算）；对账结果实时提示
function updateAdDvCheckTip() {
    var pid = (document.getElementById('adDivMatchProduct') || {}).value;
    var prod = PRODUCTS.find(function(p) { return p.id === pid; });
    var holdEl = document.getElementById('adDvHoldPrincipalShow');
    var p100P = document.getElementById('adDvPer100Principal');
    var p100I = document.getElementById('adDvPer100Interest');
    var payP = _adDvInputToYuan('adDivEditPrincipal');
    var payI = _adDvInputToYuan('adDivEditInterest');
    if (!prod) {
        if (holdEl) holdEl.textContent = '-';
        if (p100P) p100P.textContent = '-';
        if (p100I) p100I.textContent = '-';
    } else {
        var holdAmount = prod.holdAmount || 0;
        if (holdEl) holdEl.textContent = _adFmtPM(holdAmount);
        if (p100P) p100P.textContent = holdAmount > 0 ? _adFmtPM(Math.round(payP / holdAmount * 100 * 10000) / 10000) : '-';
        if (p100I) p100I.textContent = holdAmount > 0 ? _adFmtPM(Math.round(payI / holdAmount * 100 * 10000) / 10000) : '-';
    }
    // 对账结果：本息合计须等于到账金额，不等则实时提示（未选产品也照常提示）
    var tip = document.getElementById('adDvReconTip');
    if (tip) {
        var payable = Math.round((payP + payI) * 1000000) / 1000000;
        if ((payP > 0 || payI > 0) && Math.abs(_adDvCurArrival - payable) >= 0.000001) {
            tip.style.display = '';
            tip.style.color = 'var(--danger)';
            tip.innerHTML = '对账结果：本息合计 <b>' + _adFmtPM(payable) + '</b> 元，本金 + 利息 须等于到账金额（' + _adFmtPM(_adDvCurArrival) + ' 元），请核对后修改';
        } else if (payP > 0 || payI > 0) {
            tip.style.display = '';
            tip.style.color = 'var(--success, #0B975C)';
            tip.innerHTML = '对账结果：本息合计 <b>' + _adFmtPM(payable) + '</b> 元，与到账金额一致';
        } else {
            tip.style.display = 'none';
            tip.innerHTML = '';
        }
    }
}

// ============ 兑息兑付确认/驳回 ============
// 交易员关联产品并确认：确认即流程结束，自动生成凭证 + 待还款资金池记录
function confirmAdDividend(dividendId) {
    var d = DIVIDENDS.find(function(x) { return x.id === dividendId; });
    if (!d) return;
    var role = getCurrentRole();
    var now = new Date();
    var nowStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');

    // 1. 校验关联产品
    var prodId = document.getElementById('adDivMatchProduct').value;
    if (!prodId) { alert('请选择关联产品'); return; }
    var prod = PRODUCTS.find(function(p) { return p.id === prodId; });
    if (!prod) { alert('关联产品无效，请重新选择'); return; }

    // 2. 到账金额与兑付日期由财务发起时确定，交易员不可修改
    var arrA = d.arrivalAmount || 0;
    if (arrA <= 0) { alert('该单据无到账金额，请联系财务核对'); return; }

    // 3. 校验兑付数据（兑付本金非必填、兑付利息必填；本金+利息须等于到账金额）
    var newDate = d.divDate;
    var payI = _adDvInputToYuan('adDivEditInterest');
    var payP = _adDvInputToYuan('adDivEditPrincipal');
    var newRemark = document.getElementById('adDivEditRemark').value;
    var traderRemark = document.getElementById('adDivTraderRemark').value;
    if (payP < 0 || payI < 0) { alert('兑付本金/兑付利息不能为负数'); return; }
    if (payI <= 0) { alert('兑付利息必填，请填写兑付利息'); return; }
    if (payP > (prod.holdAmount || 0) + 0.000001) { alert('兑付本金不能大于当前持仓金额（¥' + _adFmtPM(prod.holdAmount) + '）'); return; }

    // 4. 系统校验：兑付本金 + 兑付利息 必须等于到账金额（不等则拦截）
    var payable = Math.round((payI + payP) * 1000000) / 1000000;
    if (Math.abs(arrA - payable) >= 0.000001) { alert('兑付本金 + 兑付利息（¥' + _adFmtPM(payable) + '）须等于到账金额（¥' + _adFmtPM(arrA) + '），请核对后修改'); return; }
    var arrI = payI;

    // 5. 回写：关联产品 + 兑付数据留痕
    var modified = false;
    var modifyRemark = ['关联产品：' + prod.name];
    d.productId = prod.id;
    d.productName = prod.name;
    d.innerCode = prod.hengtaiCode || '';
    d.externalCode = prod.externalCode || '';
    d.divDate = newDate;
    d.payPrincipal = payP;
    d.payInterest = payI;
    d.remark = newRemark;
    d.arrivalAmount = arrA;
    d.diffAmount = 0;
    d.diffRemark = '';

    d.traderConfirmUser = role.label;
    d.traderConfirmTime = nowStr;
    d.traderModified = modified;
    d.traderRemark = traderRemark || (modified ? modifyRemark.join('，') : '确认无误');
    d.status = '已完成';
    d.history.push({ user: role.label, action: '交易员关联产品并确认', time: nowStr, remark: d.traderRemark + '；兑付本金 ' + _adFmtPM(payP) + ' 元 + 兑付利息 ' + _adFmtPM(payI) + ' 元 = 实际到账 ' + _adFmtPM(arrA) + ' 元，对账一致' });

    // 兑付本金按持仓金额口径冲减持仓；持仓金额/本息累计/留痕/退出判定由 applyDividendHolding 统一处理
    var principalAmount = applyDividendHolding(prod, payP, arrI, d.id);
    if (principalAmount > 0) releasePlanQuota(prod.id, principalAmount);

    // 后台静默生成凭证 + 财务变动记录 + 待还款资金池记录；金额=实际到账金额（与审批中心口径一致，6 位小数）
    var _dvAmount = (d.arrivalAmount !== undefined && d.arrivalAmount !== null && d.arrivalAmount !== '' && !isNaN(Number(d.arrivalAmount)))
        ? Number(d.arrivalAmount)
        : Math.round(((d.payPrincipal || 0) + (d.payInterest || 0)) * 1000000) / 1000000;
    var voucherSeq = 1;
    VOUCHERS.forEach(function(v) { if (v.id && v.id.indexOf('VCH' + d.divDate.replace(/-/g,'')) === 0) voucherSeq++; });
    var voucherId = 'VCH' + d.divDate.replace(/-/g,'') + String(voucherSeq).padStart(3,'0');
    VOUCHERS.push({
        id: voucherId,
        summary: d.productName + '兑息兑付(本金' + _adFmtPM(d.payPrincipal) + '元/利息' + _adFmtPM(d.payInterest) + '元)',
        debitAccount: '1122-应收利息',
        creditAccount: '6001-投资收益',
        amount: _dvAmount,
        maker: role.label,
        makeTime: nowStr
    });
    d.voucherId = voucherId;

    var frSeq = 1;
    FINANCES.forEach(function(f) { if (f.id && f.id.indexOf('FR' + d.divDate.replace(/-/g,'')) === 0) frSeq++; });
    FINANCES.push({
        id: 'FR' + d.divDate.replace(/-/g,'') + String(frSeq).padStart(3,'0'),
        productId: d.productId,
        productName: d.productName,
        changeType: '兑息兑付',
        changeDate: d.divDate,
        changeAmount: _dvAmount,
        voucherStatus: '待确认',
        createMethod: '系统自动生成',
        source: '兑息兑付流程',
        voucherId: voucherId
    });

    // 兑息兑付款划回公司：生成待还款记录（进入待还款资金池）；入池挂载对账快照：兑付本金/兑付利息/实际到账/差额/差额备注（后续不受兑付单变更影响）
    createRepayItem('兑息兑付', d.id, d.productId, d.productName, _dvAmount, {
        payPrincipal: d.payPrincipal,
        payInterest: d.payInterest,
        arrivalAmount: (d.arrivalAmount !== undefined && d.arrivalAmount !== '') ? Number(d.arrivalAmount) : undefined,
        diffAmount: d.diffAmount,
        diffRemark: d.diffRemark
    });

    closeAdDetailModal();
    _adSafeRenderList();
    alert('确认成功，已进入待还款资金池，可在「投资管理-还款管理」发起还款。');
}

function rejectAdDividend(dividendId) {
    var reasonEl = document.getElementById('adDivRejectReason');
    var remarkEl = document.getElementById('adDivTraderRemark');
    var reason = (reasonEl && reasonEl.value) || (remarkEl && remarkEl.value);
    if (!reason) { alert('请填写驳回原因'); return; }
    var d = DIVIDENDS.find(function(x) { return x.id === dividendId; });
    if (!d) return;
    var role = getCurrentRole();
    var now = new Date();
    var nowStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    d.status = '已驳回';
    d.traderConfirmUser = d.traderConfirmUser || role.label;
    d.traderConfirmTime = d.traderConfirmTime || nowStr;
    d.traderRemark = reason;
    d.history.push({ user: role.label, action: '驳回', time: nowStr, remark: reason });
    closeAdDetailModal();
    _adSafeRenderList();
    alert('已驳回该兑息兑付申请。');
}

// ============ 普通审批：通过/驳回/撤回/终止 ============
function approveAdItem(id) {
    var a = APPROVALS.find(function(x) { return x.id === id; });
    if (!a) return;
    if (!confirm('确认通过该审批？')) return;
    var currentStep = a.steps.find(function(s) { return s.status === '当前'; });
    if (currentStep) {
        currentStep.status = '已完成';
        currentStep.time = new Date().toISOString().slice(0, 16).replace('T', ' ');
        var opinionEl = document.getElementById('adApprovalOpinion');
        if (opinionEl && opinionEl.value.trim()) {
            currentStep.opinion = opinionEl.value.trim();
        }
        if (a.type === '交易审批') {
            _adSyncTradeOnStepComplete(a, currentStep);
        }
        var idx = a.steps.indexOf(currentStep);
        var nextStep = null;
        for (var i = idx + 1; i < a.steps.length; i++) {
            if (a.steps[i].status === '待处理') { nextStep = a.steps[i]; break; }
        }
        if (nextStep) {
            nextStep.status = '当前';
        } else {
            a.status = '已通过';
        }
    }
    if (a.steps.every(function(s) { return s.status === '已完成'; })) a.status = '已通过';
    alert('审批已通过');
    closeAdDetailModal();
    _adSafeRenderList();
}

function _adSyncTradeOnStepComplete(approval, completedStep) {
    var trade = TRADES.find(function(t) { return t.id === approval.object; });
    if (!trade) return;
    var title = completedStep.title;
    var now = completedStep.time;
    if (title === '部门负责人审批') {
        trade.status = '已通过';
    } else if (title.indexOf('ERP流程-资金划拨') === 0) {
        trade.status = '执行中';
        trade.erpStep1Status = '已完成';
        trade.erpStep1Time = now;
        if (trade.erpStep2Status === '待执行') trade.erpStep2Status = '执行中';
    } else if (title.indexOf('ERP流程-创新金融') === 0) {
        trade.erpStep2Status = '已完成';
        trade.erpStep2Time = now;
    } else if (title.indexOf('交易员确认') === 0) {
        trade.traderConfirmStatus = '已确认';
        trade.status = '已成交';
        trade.actualDealAmount = trade.applyAmount;
        trade.traderConfirmTime = now;
        trade.voucherStatus = '待生成';
    }
}

function openAdRejectModal(id) {
    _adCurrentRejectId = id;
    document.getElementById('adRejectReason').value = '';
    document.getElementById('adRejectModal').style.display = 'block';
}
function closeAdRejectModal() { document.getElementById('adRejectModal').style.display = 'none'; _adCurrentRejectId = null; }

function confirmAdReject() {
    var reason = document.getElementById('adRejectReason').value.trim();
    if (!reason) { alert('请输入驳回原因'); return; }
    var a = APPROVALS.find(function(x) { return x.id === _adCurrentRejectId; });
    if (!a) return;
    a.status = '已驳回';
    var currentStep = a.steps.find(function(s) { return s.status === '当前'; });
    if (currentStep) {
        currentStep.status = '已完成';
        currentStep.result = '驳回';
        currentStep.reason = reason;
        currentStep.time = new Date().toISOString().slice(0, 16).replace('T', ' ');
    }
    if (a.type === '交易审批') {
        var trade = TRADES.find(function(t) { return t.id === a.object; });
        if (trade) trade.status = '已驳回';
    }
    alert('已驳回');
    closeAdRejectModal();
    closeAdDetailModal();
    _adSafeRenderList();
}

function withdrawAdApproval(id) {
    var a = APPROVALS.find(function(x) { return x.id === id; });
    if (!a) return;
    if (!confirm('确认撤回该审批申请？')) return;
    a.status = '已撤回';
    var currentStep = a.steps.find(function(s) { return s.status === '当前'; });
    if (currentStep) currentStep.status = '待处理';
    if (a.type === '交易审批') {
        var trade = TRADES.find(function(t) { return t.id === a.object; });
        if (trade) trade.status = '已撤回';
    }
    alert('已撤回');
    closeAdDetailModal();
    _adSafeRenderList();
}

function openAdTerminateModal(id) {
    _adCurrentTerminateId = id;
    document.getElementById('adTerminateReason').value = '';
    document.getElementById('adTerminateModal').style.display = 'block';
}
function closeAdTerminateModal() { document.getElementById('adTerminateModal').style.display = 'none'; _adCurrentTerminateId = null; }

function confirmAdTerminate() {
    var reason = document.getElementById('adTerminateReason').value.trim();
    if (!reason) { alert('请输入终止原因'); return; }
    var a = APPROVALS.find(function(x) { return x.id === _adCurrentTerminateId; });
    if (!a) return;
    a.status = '已终止';
    a.terminateReason = reason;
    var currentStep = a.steps.find(function(s) { return s.status === '当前'; });
    if (currentStep) currentStep.status = '待处理';
    if (a.type === '交易审批') {
        var trade = TRADES.find(function(t) { return t.id === a.object; });
        if (trade) trade.status = '已终止';
    }
    alert('已终止');
    closeAdTerminateModal();
    closeAdDetailModal();
    _adSafeRenderList();
}

// ============ 关闭弹窗 ============
function closeAdDetailModal() { document.getElementById('adDetailModal').style.display = 'none'; }
