/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { AcaRuleContext, hasLibrarySelected, isNotTrashcan } from '@alfresco/aca-shared/rules';
import { NodeEntry } from '@alfresco/js-api';
import { isAGSInstalled } from '../../../rules/site.evaluator';

export function canManageHolds(context: AcaRuleContext): boolean {
    const { groups } = context.profile;
    const isRecordManager = !!groups?.find(group => {
        return group.id.includes('GROUP_RecordsManager');
    });

    return isLegalHoldPluginEnabled(context) && (context.profile.isAdmin || isRecordManager);
}

export function canManageHoldsContextMenu(context: AcaRuleContext): boolean {
    return canManageHolds(context) && !hasLibrarySelected(context) && isNotTrashcan(context) && context.selection.count === 1;
}

export function isNodeOnHold(context: AcaRuleContext, node: NodeEntry): boolean {
    return isLegalHoldPluginEnabled(context) && !!node?.entry?.properties?.['rma:frozenAt'];
}

export function isLegalHoldPluginEnabled(context: AcaRuleContext): boolean {
    const flag = context.appConfig.get<boolean | string>('plugins.legalHoldEnabled', false);
    return isAGSInstalled(context) && (flag === true || flag === 'true');
}
