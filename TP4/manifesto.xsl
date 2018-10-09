<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output method="html" indent="yes"/>
    
    <xsl:template match="/">
        <html>
            <head>
                <meta charset="UTF-8"/>
            </head>
            <body>        
                <xsl:apply-templates/>
            </body>
        </html>
    </xsl:template>
    
    <xsl:template match="manifesto">
        <h1 align="center">Project Record</h1>
        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="meta">
        <hr/>
        <table width="100%" border="0">
            <tbody>
                <tr>
                    <td width="50%">
                        <b>KEY NAME:</b>
                        <xsl:value-of select="identificador"/>
                    </td>
                    
                    <td width="50%">
                        <b>BEGIN DATE:</b>
                        <xsl:value-of select="inicio"/>
                    </td>
                </tr>
                
                <tr>
                    <td width="50%">
                        <b>TITLE:</b>
                        <xsl:value-of select="titulo"/>
                    </td>
                    
                    <td width="50%">
                        <b>END DATE:</b>
                        <xsl:value-of select="fim"/>
                    </td>
                </tr>
                
                <tr>
                    <td width="50%">
                        <b>SUBTITLE:</b>
                        <xsl:value-of select="subtitulo"/>
                    </td>
                    
                    <td width="50%">
                        <b>SUPERVISOR:</b>
                        <a href="http://{supervisor/website}">
                                <xsl:value-of select="supervisor/nome"/>
                        </a> |
                            <a href="mailto:{supervisor/email}">Enviar Email</a>
                    
                    </td>
                </tr>
            </tbody>
        </table>
        <hr/>
    </xsl:template>
    
    <xsl:template match="equipa">
        <hr/>
        <h3>WorkTeam:</h3>
        <div>
            <xsl:apply-templates/>
        </div>
        <hr/>
    </xsl:template>
    
    <xsl:template match="membro">
        <p style="padding-left:3em">
            <img src="{foto}"></img>
            <xsl:value-of select="identificador"/> 
            - <a href="http://{website}"><xsl:value-of select="nome"/></a>
            |<a href="mailto:{email}">Enviar Email</a> 
            
        </p>
            
    </xsl:template>
    
    <xsl:template match="resumo">
        <hr/>
        <h3>ABSTRACT:</h3>
        <div>
            <xsl:apply-templates/>
        </div>
        <hr/>
    </xsl:template>
    
    <xsl:template match="para">
        <p>
            <xsl:apply-templates/>
        </p>
    </xsl:template>
    <xsl:template match="b">
        <b>
            <xsl:value-of select="."/>
        </b>
    </xsl:template>
    
    <xsl:template match="i">
        <i>
            <xsl:value-of select="."/>
        </i>
    </xsl:template>
    
    <xsl:template match="resultados">
        <hr/>
        <h3>Deliverables:</h3>
        <ul>
            <xsl:apply-templates/>
        </ul>
        <hr/>
    </xsl:template>
    
    <xsl:template match="resultado">
        <li>
            <a href="{@url}"><xsl:value-of select="."/></a>
        </li>
    </xsl:template>
    
</xsl:stylesheet>