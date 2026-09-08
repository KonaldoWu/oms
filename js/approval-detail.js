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
        + '.opinion-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }';
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
    var steps = [];
    steps.push({ title: '财务发起', user: d.initiator, time: d.createTime, status: '已完成' });
    if (d.status === '待交易员确认') {
        steps.push({ title: '交易员确认', user: d.traderConfirmUser || '待分配', time: '', status: '当前' });
        steps.push({ title: '财务最终确认', user: d.initiator, time: '', status: '待处理' });
    } else if (d.status === '交易员已确认') {
        steps.push({ title: '交易员确认', user: d.traderConfirmUser, time: d.traderConfirmTime, status: '已完成', result: d.traderModified ? '已修改' : '确认', reason: d.traderRemark });
        steps.push({ title: '财务最终确认', user: d.initiator, time: '', status: '当前' });
    }
    steps.push({ title: '生成凭证', user: '系统', time: '', status: '待处理' });
    steps.push({ title: '推送iBor', user: '系统', time: '', status: '待处理' });
    return {
        id: d.id,
        type: '兑息兑付确认',
        object: d.id,
        objectName: d.productName + ' - 利息' + d.interestPer100 + '/本金' + d.principalPer100 + '(每百元)',
        applicant: d.initiator,
        applyTime: d.createTime,
        status: '审批中',
        steps: steps,
        _dividendData: d
    };
}

// ============ 渲染兑息兑付详情 ============
function _adRenderDividendDetail(a) {
    var d = a._dividendData;
    var cfg = AD_TYPE_CONFIG[a.type] || {};
    document.getElementById('adDetailModalTitle').textContent = cfg.icon + ' ' + (cfg.label || a.type) + ' - ' + a.id;
    var roleKey = getCurrentRoleKey();
    var canEdit = !_adIsReadOnly();
    var isTraderStep = (d.status === '待交易员确认' && (roleKey === 'trader' || roleKey === 'demo'));
    var isFinanceStep = (d.status === '交易员已确认' && (roleKey === 'financial_staff' || roleKey === 'demo'));

    var body = '<div class="detail-info-grid" style="grid-template-columns:1fr 1fr;margin-bottom:14px;">';
    body += '<div class="detail-info-item"><div class="info-label">审批编号</div><div class="info-value">' + a.id + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">审批类型</div><div class="info-value">' + a.type + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">发起人</div><div class="info-value">' + d.initiator + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">发起时间</div><div class="info-value">' + d.createTime + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">当前状态</div><div class="info-value"><span class="status-badge ' + getStatusClass(d.status) + '">' + d.status + '</span></div></div>';
    body += '<div class="detail-info-item"><div class="info-label">关联产品</div><div class="info-value">' + d.productName + ' (' + d.productId + ')</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">产品内部编码</div><div class="info-value">' + (d.innerCode || '-') + '</div></div>';
    body += '<div class="detail-info-item"><div class="info-label">产品外部编码</div><div class="info-value">' + (d.externalCode || '-') + '</div></div>';
    body += '</div>';

    body += '<div class="detail-section-title">兑息兑付信息（iBor兑息兑付字段）</div>';
    if (isTraderStep && canEdit) {
        body += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px 16px;">';
        body += '<div class="form-group"><label style="font-size:var(--font-size-xs);color:var(--text-muted);">兑付日期</label><input type="date" id="adDivEditDate" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:var(--radius);font-size:var(--font-size-sm);" value="' + d.divDate + '"></div>';
        body += '<div class="form-group"><label style="font-size:var(--font-size-xs);color:var(--text-muted);">每百元应付利息(元)</label><input type="number" step="0.0001" id="adDivEditInterest" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:var(--radius);font-size:var(--font-size-sm);" value="' + d.interestPer100 + '"></div>';
        body += '<div class="form-group"><label style="font-size:var(--font-size-xs);color:var(--text-muted);">每百元应付本金(元)</label><input type="number" step="0.0001" id="adDivEditPrincipal" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:var(--radius);font-size:var(--font-size-sm);" value="' + d.principalPer100 + '"></div>';
        body += '<div class="form-group"><label style="font-size:var(--font-size-xs);color:var(--text-muted);">备注</label><input type="text" id="adDivEditRemark" style="width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:var(--radius);font-size:var(--font-size-sm);" value="' + (d.remark || '') + '"></div>';
        body += '<div class="form-group" style="grid-column:1/3;"><label style="font-size:var(--font-size-xs);color:var(--text-muted);">确认备注 / 驳回原因</label><textarea id="adDivTraderRemark" rows="2" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:var(--font-size-sm);resize:vertical;" placeholder="选填；确认时作为备注，驳回时作为驳回原因"></textarea></div>';
        body += '</div>';
        body += '<input type="hidden" id="adDivRejectReason" value="">';
    } else {
        body += '<div class="detail-info-grid" style="grid-template-columns:1fr 1fr;margin-bottom:6px;">';
        body += '<div class="detail-info-item"><div class="info-label">兑付日期</div><div class="info-value">' + d.divDate + '</div></div>';
        body += '<div class="detail-info-item"><div class="info-label">每百元应付利息</div><div class="info-value">' + d.interestPer100.toFixed(4) + ' 元</div></div>';
        body += '<div class="detail-info-item"><div class="info-label">每百元应付本金</div><div class="info-value">' + d.principalPer100.toFixed(4) + ' 元</div></div>';
        body += '<div class="detail-info-item" style="grid-column:1/3;"><div class="info-label">备注</div><div class="info-value">' + (d.remark || '-') + '</div></div>';
        body += '</div>';
        if (d.traderConfirmUser) {
            body += '<div class="detail-info-grid" style="grid-template-columns:1fr 1fr;margin-bottom:6px;">';
            body += '<div class="detail-info-item"><div class="info-label">交易员确认</div><div class="info-value">' + d.traderConfirmUser + ' ' + d.traderConfirmTime + (d.traderModified ? '（已修改字段）' : '') + '</div></div>';
            body += '<div class="detail-info-item" style="grid-column:1/3;"><div class="info-label">交易员备注</div><div class="info-value">' + (d.traderRemark || '-') + '</div></div>';
            body += '</div>';
        }
        if (isFinanceStep && canEdit) {
            body += '<div class="detail-section-title">驳回原因</div>';
            body += '<textarea id="adDivRejectReason" rows="3" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius);font-size:var(--font-size-sm);resize:vertical;" placeholder="如需驳回请填写原因..."></textarea>';
            body += '<input type="hidden" id="adDivTraderRemark" value="">';
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
    var footer = document.getElementById('adDetailModalFooter');
    var footerHtml = '<button class="btn btn-ghost" onclick="closeAdDetailModal()">关闭</button>';
    if (canEdit) {
        if (isTraderStep) {
            footerHtml += '<button class="btn btn-danger" onclick="rejectAdDividend(\'' + d.id + '\')">驳回</button>';
            footerHtml += '<button class="btn btn-primary" onclick="confirmAdDividend(\'' + d.id + '\', false)">确认</button>';
        } else if (isFinanceStep) {
            footerHtml += '<button class="btn btn-danger" onclick="rejectAdDividend(\'' + d.id + '\')">驳回</button>';
            footerHtml += '<button class="btn btn-success" onclick="confirmAdDividend(\'' + d.id + '\', true)">最终确认</button>';
        }
    }
    footer.innerHTML = footerHtml;
    document.getElementById('adDetailModal').style.display = 'block';
}

// ============ 兑息兑付确认/驳回 ============
function confirmAdDividend(dividendId, isFinal) {
    var d = DIVIDENDS.find(function(x) { return x.id === dividendId; });
    if (!d) return;
    var role = getCurrentRole();
    var now = new Date();
    var nowStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0') + ' ' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');

    if (!isFinal) {
        var modified = false;
        var modifyRemark = [];
        var newDate = document.getElementById('adDivEditDate').value;
        var newInterest = parseFloat(document.getElementById('adDivEditInterest').value);
        var newPrincipal = parseFloat(document.getElementById('adDivEditPrincipal').value);
        var newRemark = document.getElementById('adDivEditRemark').value;
        var traderRemark = document.getElementById('adDivTraderRemark').value;

        if (newDate !== d.divDate) { modifyRemark.push('兑付日期从' + d.divDate + '改为' + newDate); d.divDate = newDate; modified = true; }
        if (newInterest !== d.interestPer100) { modifyRemark.push('每百元应付利息从' + d.interestPer100 + '调整为' + newInterest); d.interestPer100 = newInterest; modified = true; }
        if (newPrincipal !== d.principalPer100) { modifyRemark.push('每百元应付本金从' + d.principalPer100 + '调整为' + newPrincipal); d.principalPer100 = newPrincipal; modified = true; }
        if (newRemark !== d.remark) { d.remark = newRemark; modified = true; }

        d.traderConfirmUser = role.label;
        d.traderConfirmTime = nowStr;
        d.traderModified = modified;
        d.traderRemark = traderRemark || (modified ? modifyRemark.join('，') : '确认无误');
        d.status = '交易员已确认';
        d.history.push({ user: role.label, action: '交易员确认' + (modified ? '（已修改字段）' : ''), time: nowStr, remark: d.traderRemark });
    } else {
        d.financeConfirmUser = role.label;
        d.financeConfirmTime = nowStr;
        d.status = '已完成';
        d.history.push({ user: role.label, action: '财务最终确认', time: nowStr, remark: '' });

        var voucherSeq = 1;
        VOUCHERS.forEach(function(v) { if (v.id && v.id.indexOf('VCH' + d.divDate.replace(/-/g,'')) === 0) voucherSeq++; });
        var voucherId = 'VCH' + d.divDate.replace(/-/g,'') + String(voucherSeq).padStart(3,'0');
        VOUCHERS.push({
            id: voucherId,
            summary: d.productName + '兑息兑付(利息' + d.interestPer100 + '/本金' + d.principalPer100 + '每百元)',
            debitAccount: '1122-应收利息',
            creditAccount: '6001-投资收益',
            amount: d.interestPer100 + d.principalPer100,
            maker: role.label,
            makeTime: nowStr
        });
        d.voucherId = voucherId;
        d.history.push({ user: '系统', action: '生成凭证' + voucherId, time: nowStr, remark: '' });

        var frSeq = 1;
        FINANCES.forEach(function(f) { if (f.id && f.id.indexOf('FR' + d.divDate.replace(/-/g,'')) === 0) frSeq++; });
        FINANCES.push({
            id: 'FR' + d.divDate.replace(/-/g,'') + String(frSeq).padStart(3,'0'),
            productId: d.productId,
            productName: d.productName,
            changeType: '兑息兑付',
            changeDate: d.divDate,
            changeAmount: d.interestPer100 + d.principalPer100,
            voucherStatus: '待确认',
            createMethod: '系统自动生成',
            source: '兑息兑付流程',
            voucherId: voucherId
        });
    }
    closeAdDetailModal();
    _adSafeRenderList();
    alert(isFinal ? '财务最终确认成功！已自动生成凭证' + d.voucherId + '。\n可在【财务核算】模块查看并推送到iBor。' : '交易员确认成功！已转交财务最终确认。');
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
    } else if (title === '交易员确认结束') {
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
