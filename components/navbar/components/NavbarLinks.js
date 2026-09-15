"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavbarLinks = NavbarLinks;
var navigation_1 = require("next/navigation");
var navLinks_constants_1 = require("../constants/navLinks.constants");
var NavLinkItem_1 = require("./NavLinkItem");
var navigation_menu_1 = require("@/components/ui/navigation-menu");
function NavbarLinks() {
    var pathname = (0, navigation_1.usePathname)();
    return (<navigation_menu_1.NavigationMenu className="hidden max-w-none lg:flex" align="start">
      <navigation_menu_1.NavigationMenuList className="gap-3">
        {navLinks_constants_1.NAV_LINKS.map(function (link) {
            var _a;
            return (<NavLinkItem_1.NavLinkItem key={(_a = link.href) !== null && _a !== void 0 ? _a : link.label} href={link.href} label={link.label} items={link.items} itemsGroups={link.itemsGroups} isActive={(0, navLinks_constants_1.isNavEntryActive)(pathname, link)} variant="desktop"/>);
        })}
      </navigation_menu_1.NavigationMenuList>
    </navigation_menu_1.NavigationMenu>);
}
