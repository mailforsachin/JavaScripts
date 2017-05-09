
//------------------------------------------------------------------------------------------------------
//## RESPONSE TIME MONITOR- Inhouse tool for URL latency check
//## Current version: 1.5
//## Original Author: Sachin Tewari (sachin.tewari)
//## Special Mention: Ganesh Suresh(ganesh.suresh) for event manager setup & testing.
//## v 1.0[NOT MAINTAINED] : Ping URL & get back response code. Ignore all errors except 404 PAGE NOT FOUND(Sachin Tewari)
//## v 1.1[NOT MAINTAINED] : Integrated with BEM test cell (Sachin Tewari)
//## v 1.2:  Added calling pacparser to find out appropriate proxy server(Sachin Tewari)
//## v 1.2:  First Production version (Sachin Tewari on 05/16/2012)
//## v 1.3:  Code changed to incorporate HTTP 500 errors (Sachin Tewari on 05/23/2012)
//## v 1.4:  Changed code to minimize msend. Instead of calling batch file, calling vbs instead (Sachin Tewari on 05/28/2012)
//## v 1.5:  Changed MSEND parameter to Exceeds_Thresold from Response Time Monitoring (Sachin Tewari on 05/28/2012)
/*------------------------------------------------------------------------------------------------------
FOR DEVELOPERS:

a) Remove comments i.e. // from all TAGS with ##CHECKPOINT for debug
-------------------------------------------------------------------------------------------------------*/


//##################NEW URL's NEED TO BE ADDED IN THE SYNTAX AS FOLLOWS#######################################
//##Say, for e.g. if we are to monitor TOI, you need to use
//##WScript.Echo(GetProxy("https://www.timesofindia.com")); [SPECIFYING http or https IS NECESSARY]
//####################################### SCRIPT BEGINS BELOW ##############################################

//##WScript.Echo(GetProxy("http://luffaduffadubbamee.com/"));    //##CHECKPOINT FOR NON-EXISTENT WEBSITE
//##WScript.Echo(GetProxy("http://resources.domain.com/se"));    //##CHECKPOINT FOR PAGE NOT FOUND
//##WScript.Echo(GetProxy("https://linwad5h/login"));            //##TEST FOR WINHTTP ERRORS

function GetProxy(strURL)

{
    try
    { 
        var objShell = new ActiveXObject("WScript.Shell");
        //WScript.Echo ("Finding out proxy server for: " + strURL); //##CHECKPOINT
        var objExecObject = objShell.Exec("cmd /c C:\\work\\Scripts\\RTM\\pactester -p auto.pac -u "+ strURL); //##DOWNLOAD LATEST
        var strProxyServer=null, strProxyServerFlag=null;
        do
        {
            strProxyServer = objExecObject.StdOut.ReadLine();
            //WScript.Echo("Proxy server to use: " + strProxyServer);   //##CHECKPOINT
        }while (objExecObject.StdOut.AtEndOfStream != true);
        
        
        var SearchPattern1=/ha/ig;
        var SearchPattern2=/hef/ig;
        var SearchPattern3=/sharedclient1/ig;       //##ADD MORE PROXIES HERE & ADD SEARCH PATTERN BELOW
        
        var ReturnProxyServerName1=SearchPattern1.exec(strProxyServer);
        var ReturnProxyServerName2=SearchPattern2.exec(strProxyServer);
        var ReturnProxyServerName3=SearchPattern3.exec(strProxyServer);  //## POSSIBLY COULD HAVE USED THE SAME VARIABLE ?
        
        //WScript.Echo("Matching ha is: " + ReturnProxyServerName1);  //##CHECKPOINT
        //WScript.Echo("Matching hef is: " +  ReturnProxyServerName2);  //##CHECKPOINT
        //WScript.Echo("Matching sharedclient1 is: " +ReturnProxyServerName3);//##CHECKPOINT
        
        //## IF THE PROXY SERVER IS SOMETHING ELSE OTHER THAN THE BELOW ONES, YOU WILL NEED TO ADD SEARCH PATTERN ABOVE
        //## AND CREATE A NEW IF STATEMENT EXACTLY LIKE THE ONE BELOW
        
        
        if (strProxyServer == "DIRECT")
        {
            strProxyServer= "DIRECT"; //##DIRECT CONNECTION TO INTERNET
            strProxyServerFlag=1;
            //WScript.Echo("Inside DIRECT"); //##CHECKPOINT
            WScript.Echo(getResponse(strURL,strProxyServer,strProxyServerFlag));
            strProxyServer= null;
            strProxyServerFlag= null; 
        }
        
                   
        if (ReturnProxyServerName1 == "ha")
        {
            strProxyServer= "ha.domain.com:3128";
            strProxyServerFlag=2;
            //WScript.Echo("Inside HA");//##CHECKPOINT
            WScript.Echo(getResponse(strURL,strProxyServer,strProxyServerFlag));
            strProxyServer= null;
            strProxyServerFlag= null; 
        }
        
        
                
        if (ReturnProxyServerName2 == "hef")
        {
            strProxyServer= "hef.domain.com:3128";
            strProxyServerFlag=2;
            //WScript.Echo("Inside HEF");//##CHECKPOINT
            WScript.Echo(getResponse(strURL,strProxyServer,strProxyServerFlag));
            strProxyServer= null;
            strProxyServerFlag= null; 
        }
       
        if (ReturnProxyServerName3 == "sharedclient1")
        {
            strProxyServer= "sharedclient1.domain.com:3128";
            strProxyServerFlag=2;
            //WScript.Echo("Inside sharedclient1");//##CHECKPOINT
            WScript.Echo(getResponse(strURL,strProxyServer,strProxyServerFlag));
            strProxyServer= null;
            strProxyServerFlag= null; 
        }
        
        
    } 
    
    catch (objError)
    {
        WScript.Echo ("Unable to run GetProxy function");
    }
        
    //return strProxyServer;     //CHECKPOINT RETURN
}  
    
  
    
  function getResponse(strURL,strProxyServer,strProxyServerFlag)
  {  
    
    
       
    var strResult1, strResult2, strResult3;
    //WScript.Echo ("URL is: " + strURL); //##CHECKPOINT
    //WScript.Echo ("Proxy server is: " + strProxyServer);//##CHECKPOINT
    //WScript.Echo ("ProxyServerFlag: " + strProxyServerFlag);//##CHECKPOINT
    
    
    
    try
    {
        // Create the WinHTTPRequest ActiveX Object.
        //WScript.Echo ("");
        
        //WScript.Echo ("============================================================");
        //WScript.Echo ("Today is:" & Now());
        var WinHttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
        
        //WScript.Echo(FindProxyForURL(strURL, "domain.com"));
        //WScript.Echo("ProxyServer" + GetProxyServer);
        //WinHttpReq.SetProxy( 2,"hef.domain.com:3128");     //IDENTIFY PROXY

         if (strProxyServerFlag==1 && strProxyServer=="DIRECT")
        {
            WinHttpReq.SetProxy(1);
            //WScript.Echo ("Setting proxy server as DIRECT"); //##CHECKPOINT
        }
        else
        if (strProxyServerFlag==2 && strProxyServer=="hef.domain.com:3128")
        {
            
            WinHttpReq.SetProxy(2,strProxyServer);     //IDENTIFY PROXY
            //WScript.Echo ("Setting proxy server as PROXYCACHEF");//##CHECKPOINT
        }
        else
        if (strProxyServerFlag==2 && strProxyServer=="ha.domain.com:3128")
        {
            
            WinHttpReq.SetProxy(2,strProxyServer);     //IDENTIFY PROXY
            //WScript.Echo ("Setting proxy server as ha");//##CHECKPOINT
        }
        else
        if (strProxyServerFlag==2 && strProxyServer=="sharedclient1.domain.com:3128")
        {
            
            WinHttpReq.SetProxy(2,strProxyServer);     //IDENTIFY PROXY
            //WScript.Echo ("Setting proxy server as ha");//##CHECKPOINT
        }
        //  Create an HTTP request.
        
        //WScript.Echo("Trying: "+ strURL);     //##CHECKPOINT 
        
        
      
        var temp = WinHttpReq.Open("GET", strURL, false);          //GET METHOD from false


        var URLName = strURL;
        
         
        var start = null;
        var start = new Date().getTime();   //START MEASURING THE TIME BEFORE YOU SEND THE HTTPREQUEST
        //  Send the HTTP request.
        WinHttpReq.Send();
    
        
              
        //  Retrieve the response text.
        
        strResult1 =  WinHttpReq.Status;
        //WScript.echo("At"+Now()+"~"+"The URL" +URLName+"~"+"echoed Response Code:" + strResult1+"~"+);
        
      
        if ((strResult1 == "404") || (strResult1 == "500"))           //NEED TO MODIFY THIS BIT BECAUSE 302 RESPONSE CODE IS VALID(PREFERRING SWITCH STT)
        {
           //WScript.Echo("Website is not responding. Sending event to BEM");                           
           var ResponseCode=strResult1;
           var strCurrentTime=new Date();
           var shell = new ActiveXObject("WScript.shell"); 
           //##PROD shell.run ("C:\\work\\Scripts\\RTM\\msend -n ha_default -f \"C:\\work\\Scripts\\RTM\\mcell.dir\" -a ha_RTM -r MAJOR -b \"mc_object="+URLName+";mc_object_class='Pushkar';mc_parameter='SiteDown'\" -m \"Website is not Responding\""); 
           shell.run ("C:\\work\\Scripts\\RTM\\msend -n ha_default -f \"C:\\work\\Scripts\\RTM\\mcell.dir\" -a ha_RTM -r MAJOR -b \"mc_object="+URLName+";mc_object_class='Pushkar';mc_parameter='SiteDown'\" -m \"Website is not Responding\"",7,true); //##DEV
           WScript.echo(strCurrentTime+","+URLName+","+strResult1+","+"0");
           
        }
        else
        
        {
           //WScript.Echo("Response code is not 404- Page not found or 500 Internal Server Error!");
            var elapsed =null;
            var elapsed =new Date().getTime()-start;        
          // strResult2=   WinHttpReq.ResponseText;     //##CHECKPOINT
          
           
           
           if (elapsed > "10000")
           {
               
               
               var shell1 = new ActiveXObject("WScript.shell"); 
               
               //##PROD shell1.run ("C:\\work\\Scripts\\RTM\\msend -n ha_default -f \"C:\\work\\Scripts\\RTM\\mcell.dir\" -a ha_RTM -r MAJOR -b \"mc_parameter_value="+"Total time taken is: "+elapsed+" milliseconds;mc_object="+URLName+";mc_object_class='Pushkar';mc_parameter='Exceeds_Threshold'\" -m \"Website is responding but exceeds threshold\""); 
               shell1.run ("C:\\work\\Scripts\\RTM\\msend -n ha_default -f \"C:\\work\\Scripts\\RTM\\mcell.dir\" -a ha_RTM -r MAJOR -b \"mc_parameter_value="+"Total time taken is: "+elapsed+" milliseconds;mc_object="+URLName+";mc_object_class='Pushkar';mc_parameter='Exceeds_Threshold'\" -m \"Website is responding but exceeds threshold\"",7,true); //##DEV
               var strCurrentTime=new Date();
               WScript.echo(strCurrentTime+","+URLName+","+ strResult1+","+elapsed);
           }
           
           else
            {
               var oShell2 = new ActiveXObject("WScript.shell"); 
               
               
               //##PROD oShell2.ShellExecute(commandtoRun, "-n ha_default -f \"C:\\work\\Scripts\\RTM\\mcell.dir\" -a ha_RTM -r OK -b \"mc_parameter_value="+"Total time taken is: "+elapsed+" milliseconds;mc_object="+URLName+";mc_object_class='Pushkar';mc_parameter='Exceeds_Threshold'\" -m \"Website is responding and is within threshold\"",   	  "", "open", "1");
               oShell2.run("C:\\work\\Scripts\\RTM\\msend -n ha_default -f \"C:\\work\\Scripts\\RTM\\mcell.dir\" -a ha_RTM -r OK -b \"mc_parameter_value="+"Total time taken is: "+elapsed+" milliseconds;mc_object="+URLName+";mc_object_class='Pushkar';mc_parameter='Response Time Monitoring'\" -m \"Website is responding and is within threshold\"", 7,true); //##DEV
               var strCurrentTime=new Date();
               WScript.echo(strCurrentTime+","+URLName+","+ strResult1+","+elapsed);
               
           }
        }
        
        
        
        
        
       
    }
    
    catch (objError)
    {
        strResult1 = objError + "\n"
        strResult2=strResult1 + "WinHTTP returned error: " + 
            (objError.number & 0xFFFF).toString() + "\n\n";
        //strResult3=strResult2 + objError.description;
        
        var strResult4= (objError.number & 0xFFFF).toString()+" and error description: "+objError.description;
        var shell3 = new ActiveXObject("WScript.shell"); 
        var strCurrentTime=new Date();
        var strResult5= (objError.number & 0xFFFF).toString()
        WScript.Echo(strCurrentTime+","+URLName+","+strResult5+","+"0");
        shell3.run ("C:\\work\\Scripts\\RTM\\msend -n ha_default -f \"C:\\work\\Scripts\\RTM\\mcell.dir\" -a ha_RTM -r MAJOR -b \"mc_object="+URLName+";mc_object_class='Pushkar';mc_parameter='Exceeds_Threshold'\" -m \"HTTP request failed with error code: "+strResult4+"\"",7,true); 
        
    }
    
     //  Return the response text.
    //return strResult1;     //##CHECKPOINT
   //return strResult2;      //##CHECKPOINT
   return strResult3;
    
}
