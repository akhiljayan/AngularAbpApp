using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Pulsesync.IngoTPCC.Web.App.Startup
{
    public class MenuCustomData
    {
        public MenuCustomData(bool isSliderMenu = true)
        {
            this.isSliderMenu = isSliderMenu;
        }

        public bool isSliderMenu { get; set; }

        public bool isCardBasedOnly { get; set; }

        public string CardNavigationHashKey { get; set; }
    }
}