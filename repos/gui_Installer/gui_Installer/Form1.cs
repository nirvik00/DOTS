using System;
using System.IO;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace gui_Installer
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            label1.Text = "Hello " + Environment.UserName;
            button1.Text = "Install Rhino Plug-in";
        }
        private void button1_Click(object sender, EventArgs e)
        {
            try
            {
                string currentDir = Directory.GetCurrentDirectory();
                string path = Directory.GetCurrentDirectory();
                string installPath = Directory.GetDirectories(path)[0];//install directory
                path = System.IO.Path.Combine(path, installPath);
                Console.WriteLine("dir1 :" + path);

                string guidPath = Directory.GetDirectories(path)[0];//guid directory
                path = System.IO.Path.Combine(path, guidPath);
                Console.WriteLine("dir2 :", path);

                string devPath = Directory.GetDirectories(path)[0];//dev directory
                path = System.IO.Path.Combine(path, devPath);
                string guidName = Path.GetFileName(Path.GetDirectoryName(path));

                string[] files = Directory.GetFiles(path);
                string devName = new DirectoryInfo(path).Name;
                string reqPath = Path.Combine(guidName, devName);

                string destinationDir = @"C:\Users\" + Environment.UserName + @"\AppData\Roaming\McNeel\Rhinoceros\5.0\Plug-ins\PythonPlugins";

                destinationDir = Path.Combine(destinationDir, reqPath);
                if (!Directory.Exists(destinationDir))
                {
                    System.IO.Directory.CreateDirectory(destinationDir);
                }
                foreach (string s in files)
                {
                    string fileName = System.IO.Path.GetFileName(s);
                    string destFile = System.IO.Path.Combine(destinationDir, fileName);
                    System.IO.File.Copy(s, destFile, true);
                }
                string destinationDir2 = @"C:\Users\" + Environment.UserName + @"\AppData\Roaming\McNeel\Rhinoceros\6.0\Plug-ins\PythonPlugins";

                destinationDir2 = Path.Combine(destinationDir2, reqPath);
                if (!Directory.Exists(destinationDir2))
                {
                    System.IO.Directory.CreateDirectory(destinationDir2);
                }
                foreach (string s in files)
                {
                    string fileName = System.IO.Path.GetFileName(s);
                    string destFile = System.IO.Path.Combine(destinationDir2, fileName);
                    System.IO.File.Copy(s, destFile, true);
                }
                MessageBox.Show("Installation Succeeded");
            }
            catch (Exception exc)
            {
                MessageBox.Show("Installation Failed. check admin rights...");
            }

        }

        private void label1_Click(object sender, EventArgs e)
        {
        }
        private void label2_Click(object sender, EventArgs e)
        {
        }
    }
}
