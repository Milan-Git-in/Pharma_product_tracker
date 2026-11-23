const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, "../stitch_pharma_product_tracking_system/pharma_product_tracking_system");
const appDir = path.resolve(__dirname, "../src/app");

function convertStyles(html) {
  return html.replace(/\bstyle="([^"]*)"/g, (match, styleContent) => {
    const parts = styleContent.split(";").map(s => s.trim()).filter(Boolean);
    const obj = {};
    for (const part of parts) {
      const colonIdx = part.indexOf(":");
      if (colonIdx === -1) continue;
      let prop = part.slice(0, colonIdx).trim();
      let val = part.slice(colonIdx + 1).trim();
      prop = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      obj[prop] = val;
    }
    return "style={" + JSON.stringify(obj) + "}";
  });
}

function htmlToJsx(html) {
  let jsx = html;

  // Remove scripts
  jsx = jsx.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Convert HTML comments to JSX comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, "{/* $1 */}");

  // class -> className
  jsx = jsx.replace(/\bclass="/g, "className=\"");

  // for -> htmlFor
  jsx = jsx.replace(/\bfor="/g, "htmlFor=\"");

  // tabindex -> tabIndex
  jsx = jsx.replace(/\btabindex="([^"]*)"/gi, "tabIndex={$1}");
  jsx = jsx.replace(/\btabindex=/gi, "tabIndex=");

  // autocomplete -> autoComplete
  jsx = jsx.replace(/\bautocomplete="/g, "autoComplete=\"");

  // autofocus -> autoFocus
  jsx = jsx.replace(/\bautofocus\b/g, "autoFocus");

  // readonly -> readOnly
  jsx = jsx.replace(/\breadonly=""/g, "readOnly");
  jsx = jsx.replace(/\breadonly\b/g, "readOnly");

  // disabled -> disabled
  jsx = jsx.replace(/\bdisabled=""/g, "disabled");

  // checked -> defaultChecked
  jsx = jsx.replace(/\bchecked=""/g, "defaultChecked");
  jsx = jsx.replace(/\bchecked\b/g, "defaultChecked");

  // Remove selected attribute from options
  jsx = jsx.replace(/\bselected=""/gi, "");
  jsx = jsx.replace(/\bselected\b/gi, "");

  // required="required" or required="" or required="true" -> required
  jsx = jsx.replace(/\brequired="[^"]*"/gi, "required");

  // rows="N" and cols="N" for textarea -> rows={N} cols={N}
  jsx = jsx.replace(/\brows="(\d+)"/gi, "rows={$1}");
  jsx = jsx.replace(/\bcols="(\d+)"/gi, "cols={$1}");

  // maxlength / minlength
  jsx = jsx.replace(/\bmaxlength="(\d+)"/gi, "maxLength={$1}");
  jsx = jsx.replace(/\bminlength="(\d+)"/gi, "minLength={$1}");
  jsx = jsx.replace(/\bmaxlength=/gi, "maxLength=");
  jsx = jsx.replace(/\bminlength=/gi, "minLength=");

  // colspan / rowspan
  jsx = jsx.replace(/\bcolspan="(\d+)"/gi, "colSpan={$1}");
  jsx = jsx.replace(/\browspan="(\d+)"/gi, "rowSpan={$1}");
  jsx = jsx.replace(/\bcolspan=/gi, "colSpan=");
  jsx = jsx.replace(/\browspan=/gi, "rowSpan=");

  // value="..." -> defaultValue="..." for inputs & textareas
  jsx = jsx.replace(/(<(?:input|textarea)[^>]*?)\bvalue=("[^"]*")/g, "$1defaultValue=$2");

  // SVG attributes
  jsx = jsx.replace(/\bviewbox=/gi, "viewBox=");
  jsx = jsx.replace(/\bpreserveaspectratio=/gi, "preserveAspectRatio=");
  jsx = jsx.replace(/\bstroke-width=/gi, "strokeWidth=");
  jsx = jsx.replace(/\bstroke-linecap=/gi, "strokeLinecap=");
  jsx = jsx.replace(/\bstroke-linejoin=/gi, "strokeLinejoin=");
  jsx = jsx.replace(/\bstroke-dasharray=/gi, "strokeDasharray=");
  jsx = jsx.replace(/\bstroke-dashoffset=/gi, "strokeDashoffset=");
  jsx = jsx.replace(/\bfill-rule=/gi, "fillRule=");
  jsx = jsx.replace(/\bclip-rule=/gi, "clipRule=");
  jsx = jsx.replace(/\bclip-path=/gi, "clipPath=");
  jsx = jsx.replace(/\bstop-color=/gi, "stopColor=");
  jsx = jsx.replace(/\bstop-opacity=/gi, "stopOpacity=");

  // Self-closing void tags
  jsx = jsx.replace(/<(input|img|br|hr|col|source)([^>]*?)(?<!\/)>/gi, "<$1$2 />");

  // Styles
  jsx = convertStyles(jsx);

  // Remove inline on* handlers
  jsx = jsx.replace(/\bon[a-z]+="[^"]*"/gi, "");

  // Clean entities
  jsx = jsx.replace(/&nbsp;/g, " ");

  return jsx;
}

const screenConfigs = [
  { dir: "s01_login", route: "login", code: "S01", title: "Login", customLayout: "login" },
  { dir: "s02_change_password", route: "change-password", code: "S02", title: "Change Password" },
  { dir: "s03_session_lock_overlay", route: "session-lock", code: "S03", title: "Session Lock Overlay", customLayout: "lock" },
  { dir: "s04_electronic_signature_dialog", route: "electronic-signature", code: "S04", title: "Electronic Signature Dialog" },
  { dir: "s05_initiator_dashboard", route: "", code: "S05", title: "Initiator Dashboard" },
  { dir: "s05_initiator_dashboard", route: "dashboard/initiator", code: "S05", title: "Initiator Dashboard" },
  { dir: "s05_hod_qa_dashboard_variant", route: "dashboard/hod-qa", code: "S05", title: "HOD / QA Dashboard" },
  { dir: "s06_binder_list", route: "binders", code: "S06", title: "Binder List" },
  { dir: "s07_create_edit_binder_form", route: "binders/new", code: "S07", title: "Create / Edit Binder" },
  { dir: "s08_binder_detail", route: "binders/detail", code: "S08", title: "Binder Detail" },
  { dir: "s08_binder_detail", route: "binders/[id]", code: "S08", title: "Binder Detail [id]" },
  { dir: "s09_movement_dialogs", route: "movements", code: "S09", title: "Movement Dialogs" },
  { dir: "s10_cold_room_map", route: "cold-room-map", code: "S10", title: "Cold Room Map" },
  { dir: "s11_scan_lookup", route: "scan-lookup", code: "S11", title: "Scan & Lookup" },
  { dir: "s12_reports_hub", route: "reports", code: "S12", title: "Reports Hub" },
  { dir: "s15_batch_report_print_layout", route: "reports/batch-print", code: "S15", title: "Batch Report Print Layout", customLayout: "print" },
  { dir: "s17_audit_trail_viewer", route: "audit-trail", code: "S17", title: "Audit Trail Viewer" },
  { dir: "s18_user_management", route: "admin/users", code: "S18", title: "User Management" },
  { dir: "s19_groups_access_rights", route: "admin/groups", code: "S19", title: "Groups & Access Rights" },
  { dir: "s20_masters", route: "admin/masters", code: "S20", title: "Masters Catalog" },
  { dir: "s21_barcode_designer_label_print", route: "admin/barcode-designer", code: "S21", title: "Barcode Designer & Label Print" },
  { dir: "s22_workflow_designer_stages", route: "admin/workflow/stages", code: "S22", title: "Workflow Designer - Stages" },
  { dir: "s22_workflow_designer_hold_time_rules", route: "admin/workflow/hold-time-rules", code: "S22", title: "Workflow Designer - Hold Time Rules" },
  { dir: "s22_workflow_designer_signature_routing", route: "admin/workflow/signature-routing", code: "S22", title: "Workflow Designer - Signature Routing" },
  { dir: "s24_backup_restore_system_status", route: "admin/system-status", code: "S24", title: "Backup, Restore & System Status" },
  { dir: "s24_network_failure_state", route: "network-failure", code: "S24", title: "Network Failure State" },
];

screenConfigs.forEach(conf => {
  const codePath = path.join(baseDir, conf.dir, "code.html");
  if (!fs.existsSync(codePath)) {
    console.error("Missing file: " + codePath);
    return;
  }

  const rawHtml = fs.readFileSync(codePath, "utf8");
  let contentToConvert = "";

  if (conf.customLayout === "login") {
    const mainMatch = rawHtml.match(/<main[\s\S]*?<\/main>/i);
    contentToConvert = mainMatch ? mainMatch[0] : rawHtml;
  } else if (conf.customLayout === "print") {
    const headerMatch = rawHtml.match(/<header[\s\S]*?<\/header>/i);
    const mainMatch = rawHtml.match(/<main[\s\S]*?<\/main>/i);
    contentToConvert = (headerMatch ? headerMatch[0] : "") + (mainMatch ? mainMatch[0] : "");
  } else {
    const mainMatch = rawHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (mainMatch) {
      contentToConvert = mainMatch[1];
    } else {
      contentToConvert = rawHtml;
    }
  }

  const convertedJsx = htmlToJsx(contentToConvert);

  let pageComponent = "";

  if (conf.customLayout === "login") {
    pageComponent = `"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"active" | "locked">("active");
  const [demoOpen, setDemoOpen] = useState(true);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex items-center justify-center p-gutter">
      ${convertedJsx}
    </div>
  );
}
`;
  } else if (conf.customLayout === "lock") {
    pageComponent = `"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function SessionLockPage() {
  return (
    <AppLayout screenCode="${conf.code}">
      ${convertedJsx}
    </AppLayout>
  );
}
`;
  } else if (conf.customLayout === "print") {
    pageComponent = `"use client";

import React from "react";
import Link from "next/link";

export default function BatchReportPrintPage() {
  return (
    <div className="bg-surface-container-high font-body-md text-body-md text-on-surface antialiased min-h-screen">
      ${convertedJsx}
    </div>
  );
}
`;
  } else {
    pageComponent = `"use client";

import React from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function ${conf.title.replace(/[^a-zA-Z0-9]/g, "")}Page() {
  return (
    <AppLayout screenCode="${conf.code}">
      ${convertedJsx}
    </AppLayout>
  );
}
`;
  }

  const targetDir = conf.route ? path.join(appDir, conf.route) : appDir;
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, "page.tsx"), pageComponent, "utf8");
  console.log(`Generated: ${conf.route || "/"} (${conf.code})`);
});

console.log("All pages regenerated successfully!");
